// react:
import { 
// react:
default as React, 
// hooks:
useState, useRef, useRef as _useRef, // avoids eslint check
useCallback, 
// utilities:
startTransition, 
// contexts:
createContext, useContext, } from 'react';
// reusable-ui:
import { 
// hooks:
useIsomorphicLayoutEffect, useTriggerRender, } from '@reusable-ui/hooks'; // react helper hooks
import { 
// utilities:
setRef, } from '@reusable-ui/utilities'; // common utility functions
/**
 * A react context for responsive stuff.
 */
export const ResponsiveContext = createContext(/*defaultValue :*/ {
    currentFallback: undefined,
});
ResponsiveContext.displayName = 'Responsive';
// hooks:
export const useResponsiveCurrentFallback = () => {
    // contexts:
    const responsiveContext = useContext(ResponsiveContext);
    return responsiveContext.currentFallback;
};
// utilities:
const isOverflowable = (element) => {
    const { display,
    // overflowX,
    // overflowY,
     } = getComputedStyle(element); // warning: force reflow => major performance bottleneck!
    if (display === 'none')
        return false; // hidden element => not overflowable
    // if (
    //     (overflowX !== 'visible')
    //     &&
    //     (overflowY !== 'visible')
    // )                       return false; // hidden/scroll/clip/overlay/auto/ => not overflowable
    return true; // all checks passed
};
const hasOverflowedDescendant = (element, minLeft, minTop, maxRight, maxBottom) => {
    const pixelScale = ((typeof (window) !== 'undefined') && window.devicePixelRatio) || 1;
    const children = element.children;
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        // skip non-overflowable child:
        if (!isOverflowable(child))
            continue;
        // measures child's boundaries:
        let { left: childLeft, top: childTop, right: childRight, bottom: childBottom, } = child.getBoundingClientRect(); // warning: force reflow => major performance bottleneck!
        // snap fractional css_pixel to nearest integer device_pixel:
        childLeft = Math.round(childLeft * pixelScale);
        childTop = Math.round(childTop * pixelScale);
        childRight = Math.round(childRight * pixelScale);
        childBottom = Math.round(childBottom * pixelScale);
        const { marginLeft: marginLeftStr, marginTop: marginTopStr, marginRight: marginRightStr, marginBottom: marginBottomStr, } = getComputedStyle(child); // warning: force reflow => major performance bottleneck!
        // snap fractional css_pixel to nearest integer device_pixel:
        const marginLeft = ((parseFloat(marginLeftStr) || 0) * pixelScale);
        const marginTop = ((parseFloat(marginTopStr) || 0) * pixelScale);
        const marginRight = ((parseFloat(marginRightStr) || 0) * pixelScale);
        const marginBottom = ((parseFloat(marginBottomStr) || 0) * pixelScale);
        // add cummulative shifts from ancestor:
        const minLeftShift = (minLeft === null) ? null : Math.round(minLeft + marginLeft);
        const minTopShift = (minTop === null) ? null : Math.round(minTop + marginTop);
        const maxRightShift = (maxRight === null) ? null : Math.round(maxRight - marginRight);
        const maxBottomShift = (maxBottom === null) ? null : Math.round(maxBottom - marginBottom);
        // compares child's boundaries vs max boundaries:
        if (((minLeftShift !== null)
            &&
                (childLeft < minLeftShift) // smaller than minimum => overflowed
        )
            ||
                ((minTopShift !== null)
                    &&
                        (childTop < minTopShift) // smaller than minimum => overflowed
                )
            ||
                ((maxRightShift !== null)
                    &&
                        (childRight > maxRightShift) // bigger than maximum => overflowed
                )
            ||
                ((maxBottomShift !== null)
                    &&
                        (childBottom > maxBottomShift) // bigger than maximum => overflowed
                )) {
            return true; // found
        } // if
        // nested search
        if (hasOverflowedDescendant(child, minLeftShift, minTopShift, maxRightShift, maxBottomShift))
            return true; // found
    } // for
    return false; // not found
};
export const isOverflowed = (element) => {
    // ignores non-overflowable child:
    if (!isOverflowable(element))
        return false;
    const { clientWidth, clientHeight, scrollWidth, scrollHeight, } = element; // warning: force reflow => major performance bottleneck!
    if ((scrollWidth > clientWidth) // horz scrollbar detected
        ||
            (scrollHeight > clientHeight) // vert scrollbar detected
    ) {
        return true;
    } // if
    const pixelScale = ((typeof (window) !== 'undefined') && window.devicePixelRatio) || 1;
    //#region handle padding right & bottom
    const { paddingLeft: paddingLeftStr, paddingTop: paddingTopStr, paddingRight: paddingRightStr, paddingBottom: paddingBottomStr, } = getComputedStyle(element); // warning: force reflow => major performance bottleneck!
    // snap fractional css_pixel to nearest integer device_pixel:
    const paddingLeft = ((parseFloat(paddingLeftStr) || 0) * pixelScale);
    const paddingTop = ((parseFloat(paddingTopStr) || 0) * pixelScale);
    const paddingRight = ((parseFloat(paddingRightStr) || 0) * pixelScale);
    const paddingBottom = ((parseFloat(paddingBottomStr) || 0) * pixelScale);
    const { left: elmLeft, top: elmTop, right: elmRight, bottom: elmBottom, } = element.getBoundingClientRect(); // warning: force reflow => major performance bottleneck!
    const minLeft = Math.round((elmLeft * pixelScale) + paddingLeft);
    const minTop = Math.round((elmTop * pixelScale) + paddingTop);
    const maxRight = Math.round((elmRight * pixelScale) - paddingRight);
    const maxBottom = Math.round((elmBottom * pixelScale) - paddingBottom);
    return hasOverflowedDescendant(element, minLeft, minTop, maxRight, maxBottom);
    //#endregion handle padding right & bottom
};
export const useClientAreaResizeObserver = (resizingElementRefs, clientAreaResizeCallback, options = {}) => {
    // options:
    const { horzResponsive = true, vertResponsive = false, } = options;
    // states:
    const [prevSizes] = useState(() => new Map()); // remember prev element's sizes
    // dom effects:
    useIsomorphicLayoutEffect(() => {
        // setups:
        const handleResize = (entries) => {
            let resized = false;
            for (const entry of entries) {
                const currentSize = entry.contentBoxSize[0];
                const prevSize = prevSizes.get(entry.target);
                if (prevSize && !resized) { // if has prev size record => now is the resize event
                    if (horzResponsive && (prevSize.inlineSize !== currentSize.inlineSize)) { // resized at horz axis
                        resized = true; // mark has resized
                    } // if
                    else if (vertResponsive && (prevSize.blockSize !== currentSize.blockSize)) { // resized at vert axis
                        resized = true; // mark has resized
                    } // if
                } // if
                // record the current size to be compared in the future event:
                prevSizes.set(entry.target, currentSize);
            } // for
            // fire the resize callback:
            if (resized)
                clientAreaResizeCallback();
        };
        const observer = new ResizeObserver(handleResize);
        const sizeOptions = { box: 'content-box' }; // only watch for client area
        [resizingElementRefs].flat().forEach((elmRef) => elmRef && elmRef.current && observer.observe(elmRef.current, sizeOptions));
        // cleanups:
        return () => {
            observer.disconnect();
            prevSizes.clear(); // un-reference all Element(s)
        };
    }, [...[resizingElementRefs].flat(), horzResponsive, vertResponsive, clientAreaResizeCallback]); // runs once
};
const ResponsiveProvider = (props) => {
    // rest props:
    const { 
    // responsives:
    fallbacks, useTransition = true, 
    // children:
    children: childrenFn, } = props;
    // states:
    // local storages without causing to (re)render, we need to manual control the (re)render event:
    const currentFallbackIndex = useRef(0);
    // manually controls the (re)render event:
    const [triggerRender, generation] = useTriggerRender();
    // fn props:
    const maxFallbackIndex = (fallbacks.length - 1);
    const currentFallback = (currentFallbackIndex.current <= maxFallbackIndex) ? fallbacks[currentFallbackIndex.current] : fallbacks[maxFallbackIndex];
    const childrenWithRefs = (React.Children.toArray((typeof (childrenFn) !== 'function')
        ?
            childrenFn
        :
            childrenFn(currentFallback))
        .map((child) => {
        if (!React.isValidElement(child))
            return {
                child,
                ref: null,
            };
        const childRef = _useRef(null);
        const refName = (typeof (child.type) !== 'function') ? 'ref' : 'outerRef'; // assumes all function components are valid reusable-ui_component
        const childModif = React.cloneElement(child, {
            [refName]: (elm) => {
                setRef(child[refName], elm); // preserves the original ref|outerRef
                setRef(childRef, elm); // append a new childRef
            },
        });
        return {
            child: childModif,
            ref: childRef,
        };
    }));
    // dom effects:
    const childRefs = childrenWithRefs.map(({ ref }) => ref);
    //#region reset the fallback index to zero every container's client area resized
    const clientAreaResizeCallback = useCallback(() => {
        // reset to the first fallback (0th):
        currentFallbackIndex.current = 0;
        if (useTransition) {
            // lazy responsives => a bit delayed of responsives is ok:
            startTransition(() => {
                triggerRender();
            });
        }
        else {
            // greedy responsives => no delayed of responsives:
            triggerRender();
        } // if
    }, [useTransition]);
    useClientAreaResizeObserver(childRefs, clientAreaResizeCallback, props);
    //#endregion reset the fallback index to zero every container's client area resized
    //#region (re)calculates the existence of overflowed_layout each time the generation updated
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (currentFallbackIndex.current >= maxFallbackIndex)
            return; // maximum fallbacks has already reached => nothing more fallback
        const hasOverflowed = childRefs.some((childRef) => {
            const child = childRef?.current;
            if (!child)
                return false;
            return isOverflowed(child);
        });
        if (hasOverflowed) {
            // current fallback has a/some overflowed_layout => not satisfied => try the next fallback:
            currentFallbackIndex.current++;
            // an urgent update, the user should not to see any overflowed_layout:
            triggerRender();
        } // if
    }, [generation]); // runs each time the generation updated
    //#endregion (re)calculates the existence of overflowed_layout each time the generation updated
    // jsx:
    return (React.createElement(ResponsiveContext.Provider, { value: { currentFallback } }, childrenWithRefs.map(({ child }) => child)));
};
export { ResponsiveProvider, ResponsiveProvider as default, };
