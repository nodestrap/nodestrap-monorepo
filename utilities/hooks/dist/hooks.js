// react:
import { 
// hooks:
useEffect, useLayoutEffect, useReducer, } from 'react';
// other libs:
import { 
// tests:
isBrowser, isJsDom, } from 'is-in-browser';
// utilities:
export const isClientSide = isBrowser || isJsDom;
// hooks:
/**
 * A React helper hook for using `useLayoutEffect` with a fallback to a regular `useEffect` for environments where `useLayoutEffect` should not be used (such as server-side rendering).
 */
export const useIsomorphicLayoutEffect = isClientSide ? useLayoutEffect : useEffect;
const triggerRenderReducer = (_currentGeneration, _action) => {
    return {}; // update with a new object
};
/**
 * Manually controls the (re)render event.
 */
export const useTriggerRender = () => {
    const [generation, setState] = useReducer(triggerRenderReducer, {});
    return [setState, generation];
};
