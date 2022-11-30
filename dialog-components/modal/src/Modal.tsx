// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
    useState,
}                           from 'react'
import {
    createPortal,
}                           from 'react-dom'

// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    CssRule,
    CssStyleCollection,
    
    
    
    // writes css in javascript:
    rule,
    variants,
    states,
    keyframes,
    children,
    style,
    imports,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
    usesCssProps,
    usesPrefixedProps,
}                           from '@cssfn/core'                  // writes css in javascript
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // a set of React node utility functions:
    isReusableUiComponent,
    
    
    
    // removes browser's default stylesheet:
    stripoutFocusableElement,
    
    
    
    // focusing functions:
    setFocusNext,
    
    
    
    // react helper hooks:
    useTriggerRender,
    useEvent,
    EventHandler,
    useMergeEvents,
    useMergeRefs,
    useMergeClasses,
    
    
    
    // a set of client-side functions:
    isClientSide,
    
    
    
    // animation stuff of UI:
    usesAnimation,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ifCollapsed,
    usesCollapsible,
    ExpandedChangeEvent,
    CollapsibleProps,
    useCollapsible,
    ToggleCollapsibleProps,
    
    
    
    // a capability of UI to highlight itself to attract user's attention:
    usesExcitable,
    ExcitedChangeEvent,
    useToggleExcitable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    GenericProps,
    Generic,
}                           from '@reusable-ui/generic'         // a generic component



// defaults:
const _defaultBackdropStyle : BackdropStyle  = 'regular'



// utilities:
const getViewportOrDefault = (modalViewport: React.RefObject<Element>|Element|null|undefined): Element => {
    return (
        // custom viewport (if was set):
        (
            modalViewport
            ?
            ((modalViewport.constructor === Object) ? (modalViewport as React.RefObject<Element>)?.current : (modalViewport as Element))
            :
            null
        )
        ??
        // the default viewport is <body>:
        document.body
    );
};



// rules:
export const ifGlobalModal = (styles: CssStyleCollection): CssRule => rule('body>*>&', styles);



// configs:
export const [modals, modalValues, cssModalConfig] = cssConfig(() => {
    // dependencies:
    
    const {animationRegistry : {filters}              } = usesAnimation();
    const {excitableVars     : {filter: filterExcited}} = usesExcitable();
    
    
    
    //#region keyframes
    const frameCollapsed    = style({
        filter : [[
            'opacity(0)',
        ]]
    });
    const frameExpanded     = style({
        filter : [[
            'opacity(1)',
        ]]
    });
    const [keyframesExpandRule  , keyframesExpand  ] = keyframes({
        from  : frameCollapsed,
        to    : frameExpanded,
    });
    keyframesExpand.value   = 'expand';   // the @keyframes name should contain 'expand'   in order to be recognized by `useCollapsible`
    const [keyframesCollapseRule, keyframesCollapse] = keyframes({
        from  : frameExpanded,
        to    : frameCollapsed,
    });
    keyframesCollapse.value = 'collapse'; // the @keyframes name should contain 'collapse' in order to be recognized by `useCollapsible`
    
    
    
    const [keyframesExciteRule, keyframesExcite] = keyframes({
        from  : {
            filter : [[
                ...filters.filter((f) => (f !== filterExcited)), // the rest filter(s)
            ]],
        },
        to    : {
            filter : [[
                ...filters.filter((f) => (f !== filterExcited)), // the rest filter(s)
                filterExcited, // the interpolating filter
            ]],
        },
    });
    keyframesExcite.value = 'excite'; // the @keyframes name should contain 'excite' in order to be recognized by `useToggleExcitable`
    //#endregion keyframes
    
    
    
    return {
        // backgrounds:
        backg               : 'rgba(0,0,0, 0.5)'                    as CssKnownProps['background'],
        
        
        
        // borders:
        // modalUiBoxShadow    : [[0, 0, '10px', 'rgba(0,0,0,0.5)']]   as CssKnownProps['boxShadow' ],
        modalUiFilter: [
            ['drop-shadow(', 0, 0, '10px', 'rgba(0,0,0,0.5)', ')'],
        ]                                                           as CssKnownProps['filter'],
        
        
        
        // animations:
        ...keyframesExpandRule,
        ...keyframesCollapseRule,
        animExpand          : [
            ['300ms', 'ease-out', 'both', keyframesExpand  ],
        ]                                                           as CssKnownProps['animation'],
        animCollapse        : [
            ['500ms', 'ease-out', 'both', keyframesCollapse],
        ]                                                           as CssKnownProps['animation'],
        
        modalUiFilterExcite : [[
            'invert(80%)',
        ]]                                                          as CssKnownProps['filter'   ],
        
        ...keyframesExciteRule,
        modalUiAnimExcite   : [
            ['150ms', 'ease', 'both', 'alternate-reverse', 5, keyframesExcite],
        ]                                                           as CssKnownProps['animation'],
    };
}, { prefix: 'mdl' });



// styles:
export type BackdropStyle = 'regular'|'hidden'|'interactive'|'static' // might be added more styles in the future
export interface BackdropVariant {
    backdropStyle ?: BackdropStyle
}
export const useBackdropVariant = ({backdropStyle = _defaultBackdropStyle}: BackdropVariant) => {
    return {
        class: (backdropStyle === 'regular') ? null : backdropStyle,
    };
};



export const usesModalUiLayout = () => {
    // dependencies:
    
    // features:
    const {animationRule, animationVars} = usesAnimation();
    
    
    
    return style({
        ...imports([
            // resets:
            stripoutFocusableElement(), // clear browser's default styles
            
            // features:
            animationRule,
        ]),
        ...style({
            // customize:
            ...usesCssProps(usesPrefixedProps(modals, 'modalUi')), // apply config's cssProps starting with modalUi***
            
            
            
            // animations:
            anim : animationVars.anim,
        }),
    });
};
export const usesModalUiStates = () => {
    // dependencies:
    
    // states:
    const {excitableRule} = usesExcitable(
        usesPrefixedProps(modals, 'modalUi') as any, // fetch config's cssProps starting with modalUi***
    );
    
    
    
    return style({
        ...imports([
            // states:
            excitableRule,
        ]),
    });
};

export const useModalUiStyleSheet = dynamicStyleSheet(() => ({
    ...imports([
        // layouts:
        usesModalUiLayout(),
        
        // states:
        usesModalUiStates(),
    ]),
}), { specificityWeight: 0, id: 'u4teynvq1y' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export const usesBackdropLayout = () => {
    // dependencies:
    
    // features:
    const {animationRule, animationVars} = usesAnimation();
    
    
    
    return style({
        ...imports([
            // features:
            animationRule,
        ]),
        ...style({
            // layouts:
            display      : 'grid',
            
            // child default sizes:
            justifyItems : 'center', // center horizontally
            alignItems   : 'center', // center vertically
            
            
            
            // positions:
            position     : 'absolute', // local <Modal>: absolute position
            ...ifGlobalModal({
                position : 'fixed',    // global <Modal>: directly inside `body > portal` => fixed position
            }),
            inset        : 0,          // span the <Modal> to the edges of <container>
            zIndex       : 1040,
            
            
            
            // sizes:
            // global <Modal>: fills the entire screen height:
            ...ifGlobalModal({
                boxSizing    : 'border-box', // the final size is including borders & paddings
                minBlockSize : '100vh',
            }),
            
            
            
            // customize:
            ...usesCssProps(modals), // apply config's cssProps
            
            
            
            // animations:
            anim         : animationVars.anim,
        }),
    });
};
export const usesBackdropVariants = () => {
    return style({
        ...variants([
            rule('.hidden', {
                // backgrounds:
                background    : 'none',
            }),
            rule(['.hidden', '.interactive'], {
                // accessibilities:
                pointerEvents : 'none', // a ghost layer
                
                
                
                // children:
                ...children('*', { // <ModalUi>
                    // accessibilities:
                    pointerEvents : 'initial', // cancel out ghost layer
                }),
            }),
        ]),
    });
};
export const usesBackdropStates = () => {
    // dependencies:
    
    // states:
    const {collapsibleRule} = usesCollapsible(modals);
    
    
    
    return style({
        ...imports([
            // states:
            collapsibleRule,
        ]),
        ...states([
            ifCollapsed({
                // appearances:
                display: 'none', // hide the <Modal>
            }),
        ]),
    });
};

export const useBackdropStyleSheet = dynamicStyleSheet(() => ({
    ...imports([
        // layouts:
        usesBackdropLayout(),
        
        // variants:
        usesBackdropVariants(),
        
        // states:
        usesBackdropStates(),
    ]),
}), { id: 'z26pqrin5i' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:

export interface ModalUiComponentProps<TElement extends Element = HTMLElement>
    extends
        // accessibilities:
        Pick<React.HTMLAttributes<HTMLElement>, 'tabIndex'>
{
    // components:
    children : React.ReactElement<GenericProps<TElement>|React.HTMLAttributes<HTMLElement>|React.SVGAttributes<SVGElement>>
}

export type ModalActionType = 'shortcut'|'backdrop'|'ui'|{}
export interface ModalExpandedChangeEvent extends ExpandedChangeEvent {
    actionType : ModalActionType
}

export interface ModalProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent = ModalExpandedChangeEvent>
    extends
        // bases:
        Omit<GenericProps<TElement>,
            // children:
            |'children' // we redefined `children` prop as a <ModalUi> component
        >,
        
        // states:
        CollapsibleProps<TModalExpandedChangeEvent>,
        Pick<ToggleCollapsibleProps<TModalExpandedChangeEvent>,
            |'onExpandedChange' // implements `onExpandedChange` (implements controllable only, uncontrollable is not implemented)
        >,
        
        // behaviors:
        BackdropVariant,
        
        // components:
        ModalUiComponentProps<Element>
{
    // accessibilities:
    setFocus      ?: boolean
    restoreFocus  ?: boolean
    
    
    
    // behaviors:
    lazy          ?: boolean
    
    
    
    // modals:
    modalViewport ?: React.RefObject<Element>|Element|null // getter ref
}
const Modal = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent = ModalExpandedChangeEvent>(props: ModalProps<TElement, TModalExpandedChangeEvent>): JSX.Element|null => {
    // styles:
    const styleSheet      = useBackdropStyleSheet();
    const uiStyleSheet    = useModalUiStyleSheet();
    
    
    
    // variants:
    const backdropVariant = useBackdropVariant(props);
    
    
    
    // rest props:
    const {
        // accessibilities:
        setFocus      = true,
        restoreFocus  = true,
        
        
        
        // states:
        expanded      : _expanded, // remove
        onExpandedChange,
        
        
        
        // behaviors:
        backdropStyle = 'regular',
        lazy          = false,
        
        
        
        // modals:
        modalViewport,
        
        
        
        // components:
        tabIndex,
        children      : modalUiComponent,
    ...restGenericProps} = props;
    
    
    
    // states:
    const collapsibleState = useCollapsible<TElement, TModalExpandedChangeEvent>(props);
    const isVisible        = collapsibleState.isVisible; // visible = showing, shown, hidding ; !visible = hidden
    const isExpanded       = collapsibleState.expanded;
    const isModal          = isVisible && !['hidden', 'interactive'].includes(backdropStyle);
    
    const [excitedDn, setExcitedDn] = useState(false);
    const handleExcitedChange       = useEvent<EventHandler<ExcitedChangeEvent>>((event) => {
        setExcitedDn(event.excited);
    });
    const excitableState            = useToggleExcitable<HTMLElement|SVGElement>({ excited: excitedDn, onExcitedChange: handleExcitedChange });
    
    
    
    // verifies:
    React.Children.only(modalUiComponent);
    const isReusableUiModalComponent : boolean = isReusableUiComponent<GenericProps<Element>>(modalUiComponent);
    if (!isReusableUiModalComponent && !React.isValidElement<GenericProps<Element>|React.HTMLAttributes<HTMLElement>|React.SVGAttributes<SVGElement>>(modalUiComponent)) throw Error('Invalid child element.');
    
    
    
    // refs:
    const modalUiRefInternal = useRef<Element|null>(null);
    const mergedModalUiRef   = useMergeRefs(
        // preserves the original `ref` from `modalUiComponent`:
        (
            isReusableUiModalComponent
            ?
            (modalUiComponent.props as GenericProps<Element>).elmRef
            :
            (modalUiComponent.props as React.RefAttributes<Element>).ref
        ),
        
        
        
        modalUiRefInternal,
    );
    const portalRefInternal  = useRef<HTMLDivElement|null>(null);
    const prevFocusRef       = useRef<Element|null>(null);
    
    
    
    // classes:
    const variantClasses = useMergeClasses(
        // preserves the original `variantClasses`:
        props.variantClasses,
        
        
        
        // variants:
        backdropVariant.class,
    );
    const stateClasses   = useMergeClasses(
        // preserves the original `stateClasses`:
        props.stateClasses,
        
        
        
        // states:
        collapsibleState.class,
    );
    const modalUiClasses = useMergeClasses(
        // preserves the original `classes` from `modalUiComponent`:
        (
            isReusableUiModalComponent
            ?
            (modalUiComponent.props as GenericProps<Element>).classes
            :
            ((modalUiComponent.props as React.HTMLAttributes<HTMLElement>|React.SVGAttributes<SVGElement>).className ?? '').split(' ')
        ),
        
        
        
        // styles:
        uiStyleSheet.main,
        
        
        
        // states:
        excitableState.class,
    );
    
    
    
    // handlers:
    const handleExpandedChange        = onExpandedChange;
    const handleKeyDownInternal       = useEvent<React.KeyboardEventHandler<TElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
        
        
        
        if (((): boolean => {
            const keyCode = event.code.toLowerCase();
            
            
            
            if (!isModal) {
                return false; // interactive|hidden => do not trap the [tab]
            }
            else if (isModal && (keyCode === 'tab'))
            {
                setFocusNext(event.currentTarget);
            }
            else if (
                (keyCode === 'pagedown'  ) ||
                (keyCode === 'pageup'    ) ||
                (keyCode === 'home'      ) ||
                (keyCode === 'end'       ) ||
                (keyCode === 'arrowdown' ) ||
                (keyCode === 'arrowup'   ) ||
                (keyCode === 'arrowleft' ) ||
                (keyCode === 'arrowright') ||
                (keyCode === 'space'     )
            )
            {
                // do nothing
                // do not scroll the page
            }
            else return false; // not handled
            
            
            
            return true; // handled
        })()) {
            event.preventDefault(); // prevents the whole page from scrolling when the user press the [up],[down],[left],[right],[pg up],[pg down],[home],[end]
        } // if
    });
    const handleKeyDown               = useMergeEvents(
        // preserves the original `onKeyDown`:
        props.onKeyDown,
        
        
        
        // actions:
        handleKeyDownInternal,
    );
    const handleMouseDownInternal     = useEvent<React.MouseEventHandler<TElement> & React.TouchEventHandler<TElement>>((event) => {
        // conditions:
        if (event.defaultPrevented)               return; // the event was already handled by user => nothing to do
        if (event.target !== event.currentTarget) return; // ignore bubbling from <ModalUi>
        
        
        
        // actions:
        if (backdropStyle === 'static') {
            setExcitedDn(true); // make <ModalUi> blinking
            (modalUiRefInternal.current as HTMLElement|SVGElement|null)?.focus({ preventScroll: true }); // re-focus to the <ModalUi>, so the focus is trapped inside the <Modal>
        }
        else {
            // backdrop clicked => request to hide the <Modal>:
            handleExpandedChange?.({ expanded: false, actionType: 'backdrop' } as TModalExpandedChangeEvent);
        } // if
        if (event.type !== 'touchstart') event.preventDefault(); // handled
    });
    const handleMouseDown             = useMergeEvents(
        // preserves the original `onMouseDown` from `props`:
        props.onMouseDown,
        
        
        
        // actions:
        handleMouseDownInternal,
    );
    const handleTouchStart            = useMergeEvents(
        // preserves the original `onTouchStart` from `props`:
        props.onTouchStart,
        
        
        
        // actions:
        handleMouseDownInternal,
    );
    const handleContextMenuInternal   = useEvent<React.MouseEventHandler<TElement>>((event) => {
        // conditions:
        if (event.defaultPrevented)               return; // the event was already handled by user => nothing to do
        if (event.target !== event.currentTarget) return; // only cancels the contextMenu at the <overlay>, allows at the <ModalUi>
        
        
        
        // actions:
        // cancel the contextMenu:
        event.preventDefault(); // handled
    });
    const handleContextMenu           = useMergeEvents(
        // preserves the original `onContextMenu` from `props`:
        props.onContextMenu,
        
        
        
        // actions:
        handleContextMenuInternal,
    );
    const handleAnimationStart        = useMergeEvents(
        // preserves the original `onAnimationStart`:
        props.onAnimationStart,
        
        
        
        // states:
        collapsibleState.handleAnimationStart,
    );
    const handleAnimationEnd          = useMergeEvents(
        // preserves the original `onAnimationEnd`:
        props.onAnimationEnd,
        
        
        
        // states:
        collapsibleState.handleAnimationEnd,
    );
    const handleModalUiAnimationStart = useMergeEvents<React.AnimationEvent<HTMLElement & SVGElement>>(
        // preserves the original `onAnimationStart` from `modalUiComponent`:
        modalUiComponent.props.onAnimationStart,
        
        
        
        // states:
        excitableState.handleAnimationStart,
    );
    const handleModalUiAnimationEnd   = useMergeEvents<React.AnimationEvent<HTMLElement & SVGElement>>(
        // preserves the original `onAnimationEnd` from `modalUiComponent`:
        modalUiComponent.props.onAnimationEnd,
        
        
        
        // states:
        excitableState.handleAnimationEnd,
    );
    
    
    
    // dom effects:
    
    // set focus on <ModalUi> each time it shown:
    useEffect(() => {
        // setups:
        if (isExpanded) {
            // backup the current focused element (if any):
            prevFocusRef.current = document.activeElement;
            
            // when shown => focus the <ModalUi>, so the user able to use [esc] key to close the <Modal>:
            if (setFocus) {
                (modalUiRefInternal.current as HTMLElement|SVGElement|null)?.focus({ preventScroll: true });
            } // if
        }
        else {
            // if current focused element is inside the <Modal> => back focus to <prevFocusRef>:
            const prevFocusElm = prevFocusRef.current;
            if (restoreFocus && prevFocusElm && (prevFocusElm as HTMLElement|SVGElement).focus) {
                setTimeout(() => {
                    // conditions:
                    const focusedElm = document.activeElement;
                    if (!focusedElm) return; // nothing was focused => nothing to do
                    
                    const modalUi = modalUiRefInternal.current;
                    if (                                 // neither
                        !(modalUi?.contains(focusedElm)) // the current focused element is inside the <Modal>
                    ) return;                            // => nothing to focus
                    
                    
                    
                    // restore the previously focused element (if any):
                    (prevFocusElm as HTMLElement|SVGElement).focus({ preventScroll: true });
                }, 0); // wait until the user decided to change the focus to another <element>
            } // if
            
            
            
            // unreference the restored focused element:
            prevFocusRef.current = null;
        } // if
    }, [isExpanded]);
    
    // prevent the <viewport> from scrolling when in modal (blocking) mode:
    useEffect(() => {
        // conditions:
        if (!isModal) return; // only modal (blocking) mode
        
        
        
        // setups:
        const viewportElm         = getViewportOrDefault(modalViewport);
        
        const scrollableElm       = (viewportElm === document.body) ? document.documentElement : viewportElm;
        const scrollableEvent     = (viewportElm === document.body) ? document                 : viewportElm;
        const currentScrollTop    = scrollableElm.scrollTop;
        const currentScrollLeft   = scrollableElm.scrollLeft;
        
        const handlePreventScroll = (event: Event) => {
            if (event.target === scrollableEvent) { // only handle click on the viewport, ignores click bubbling from the children
                scrollableElm.scrollTop  = currentScrollTop;  // prevent from scrolling by keeping the initial scroll position
                scrollableElm.scrollLeft = currentScrollLeft; // prevent from scrolling by keeping the initial scroll position
            } // if
        };
        
        scrollableEvent.addEventListener('scroll', handlePreventScroll);
        
        
        
        // cleanups:
        return () => {
            scrollableEvent.removeEventListener('scroll', handlePreventScroll);
        };
    }, [isModal, modalViewport]);
    
    // delays the rendering of portal until the page is fully hydrated
    const [triggerRender] = useTriggerRender();
    useEffect(() => {
        // conditions:
        if (!isClientSide) return; // client side only, server side => ignore
        
        
        
        // setups:
        const viewportElm = getViewportOrDefault(modalViewport);
        const portalElm = document.createElement('div');
        viewportElm.appendChild(portalElm);
        portalRefInternal.current = portalElm;
        
        triggerRender(); // re-render with hydrated version
        
        
        
        // cleanups:
        return () => {
            viewportElm.removeChild(portalElm);
            portalRefInternal.current = null;
        };
    }, [modalViewport]);
    
    // stops the excited state when modal is closed:
    useEffect(() => {
        // conditions:
        if (isExpanded) return; // <Modal> is still shown => ignore
        if (!excitedDn) return; // <Modal> is not excited => ignore
        
        
        
        // actions:
        setExcitedDn(false);
    }, [isExpanded, excitedDn]);
    
    // watch [esc] key globally, when non modal (interactive|hidden) mode:
    useEffect(() => {
        // conditions:
        if (!isExpanded) return; // <Modal> is not expanded => ignore
        
        
        
        // handlers:
        const handleKeyDown = (event: KeyboardEvent) => {
            const keyCode = event.code.toLowerCase();
            
            
            
            if ((keyCode === 'escape')) {
                // [esc] key pressed => request to hide the <Modal>:
                handleExpandedChange?.({ expanded: false, actionType: 'shortcut' } as TModalExpandedChangeEvent);
                // event.preventDefault(); // no need to mark as handled, because it's a global event
            } // if
        };
        
        
        
        // setups:
        document.addEventListener('keydown', handleKeyDown);
        
        
        
        // cleanups:
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isExpanded, handleExpandedChange]);
    
    
    
    // jsx:
    const portalElm = portalRefInternal.current;
    if (!portalElm) return null; // server side -or- client side but not already hydrated => nothing to render
    return createPortal(
        <Generic<TElement>
            // other props:
            {...restGenericProps}
            
            
            
            // semantics:
            semanticRole={props.semanticRole ?? 'dialog'}
            
            aria-modal={props['aria-modal'] ?? (isModal || undefined)}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
            
            
            
            // handlers:
            onKeyDown        = {handleKeyDown       }
            onMouseDown      = {handleMouseDown     }
            onTouchStart     = {handleTouchStart    }
            onContextMenu    = {handleContextMenu   }
            onAnimationStart = {handleAnimationStart}
            onAnimationEnd   = {handleAnimationEnd  }
        >
            {/* <ModalUi> */}
            {(!lazy || isVisible) && React.cloneElement<GenericProps<Element> & React.RefAttributes<Element> & React.HTMLAttributes<Element>>(modalUiComponent,
                // props:
                {
                    // refs:
                    [isReusableUiModalComponent ? 'elmRef' : 'ref'] : mergedModalUiRef,
                    
                    
                    
                    // classes:
                    ...(isReusableUiModalComponent ? {
                        classes      : modalUiClasses,
                    } : {
                        className    : modalUiClasses.filter((c) => !!c).join(' '),
                    }),
                    
                    
                    
                    // accessibilities:
                    tabIndex         : (modalUiComponent.props as React.HTMLAttributes<HTMLElement>).tabIndex ?? tabIndex,
                    
                    
                    
                    // [open]:
                    ...collapsibleState.props,
                    
                    
                    
                    // handlers:
                    onAnimationStart : handleModalUiAnimationStart,
                    onAnimationEnd   : handleModalUiAnimationEnd,
                },
            )}
        </Generic>
    , portalElm);
};
export {
    Modal,
    Modal as default,
}



export interface ModalComponentProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent = ModalExpandedChangeEvent>
{
    // refs:
    modalRef       ?: React.Ref<TElement> // setter ref
    
    
    
    // variants:
    backdropStyle  ?: ModalProps<TElement, TModalExpandedChangeEvent>['backdropStyle']
    
    
    
    // modals:
    modalViewport  ?: ModalProps<TElement, TModalExpandedChangeEvent>['modalViewport']
    
    
    
    // components:
    modalComponent ?: React.ReactComponentElement<any, ModalProps<TElement, TModalExpandedChangeEvent>>
}
