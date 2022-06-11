// react:
import {
    // hooks:
    useEffect,
    useLayoutEffect,
    useReducer,
    useCallback,
    useMemo,
}                           from 'react'

// cssfn:
import type {
    // types:
    Optional,
    SingleOrArray,
}                           from '@cssfn/types'

// other libs:
import {
    // tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



// utilities:
export const isClientSide : boolean = isBrowser || isJsDom;



// hooks:

/**
 * A React helper hook for using `useLayoutEffect` with a fallback to a regular `useEffect` for environments where `useLayoutEffect` should not be used (such as server-side rendering).
 */
export const useIsomorphicLayoutEffect = isClientSide ? useLayoutEffect : useEffect;



const triggerRenderReducer = (_currentGeneration: object, _action: void): object => {
    return {}; // update with a new object
};
/**
 * Manually controls the (re)render event.
 */
export const useTriggerRender = () => {
    const [generation, setState] = useReducer(triggerRenderReducer, {});
    return [setState, generation] as const;
};



export { useCallback as useEvent };

export const useMergeEvents = <TEvent extends React.SyntheticEvent<any>>(...eventHandlers: Optional<React.EventHandler<TEvent>>[]): React.EventHandler<TEvent>|undefined => {
    return useMemo<React.EventHandler<TEvent>|undefined>(() => {
        // check if singular eventHandler:
        let firstEventHandler : React.EventHandler<TEvent>|undefined = undefined;
        let multiEventHandlers = false;
        for (const eventHandler of eventHandlers) {
            if (!eventHandler) continue; // ignores empty eventHandler
            
            
            
            if (!firstEventHandler) {
                firstEventHandler = eventHandler;
            }
            else {
                multiEventHandlers = true;
                break; // no need for testing more eventHandlers
            } // if
        } // for
        if (!multiEventHandlers) return firstEventHandler;
        
        
        
        // merge eventHandlers:
        return (event) => {
            for (const eventHandler of eventHandlers) {
                eventHandler?.(event);
            } // for
            // eslint-disable-next-line
        };
    }, [...eventHandlers]);
};



export const useMergeRefs = <TValue>(...refs: Optional<React.Ref<TValue>>[]): React.Ref<TValue>|undefined => {
    return useMemo<React.Ref<TValue>|undefined>(() => {
        // check if singular ref:
        let firstRef : React.Ref<TValue>|undefined = undefined;
        let multiRefs = false;
        for (const ref of refs) {
            if (!ref) continue; // ignores empty ref
            
            
            
            if (!firstRef) {
                firstRef = ref;
            }
            else {
                multiRefs = true;
                break; // no need for testing more refs
            } // if
        } // for
        if (!multiRefs) return firstRef;
        
        
        
        // merge refs:
        return (value) => {
            for (const ref of refs) {
                if (typeof(ref) === 'function') {
                    ref?.(value);
                }
                else {
                    (ref as React.MutableRefObject<TValue|null>).current = value;
                } // if
            } // for
            // eslint-disable-next-line
        };
    }, [...refs]);
};



export const useMergeClasses = <TValue>(...classes: SingleOrArray<Optional<string>>[]): Optional<string>[] => {
    return useMemo<Optional<string>[]>(() => {
        return classes.flat();
    }, [...classes]);
};
