// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// cssfn:
import type {
    // types:
    Factory,
}                           from '@cssfn/types'                 // cssfn general types
import type {
    // css known (standard) properties:
    CssKnownProps,
    
    
    
    // cssfn properties:
    CssRule,
    
    CssStyleCollection,
}                           from '@cssfn/css-types'             // cssfn css specific types
import {
    // rules:
    rule,
    states,
    
    
    
    // styles:
    style,
    vars,
}                           from '@cssfn/cssfn'                 // writes css in javascript
import {
    // utilities:
    CssVars,
    cssVars,
}                           from '@cssfn/css-vars'              // strongly typed of css variables

// reusable-ui utilities:
import {
    // hooks:
    useEvent,
}                           from '@reusable-ui/hooks'           // react helper hooks
import {
    // hooks:
    SemanticProps,
    useSemantic,
}                           from '@reusable-ui/semantics'       // a semantic management system for react web components
import {
    // hooks:
    usePropEnabled,
    
    
    
    // react components:
    AccessibilityProps,
}                           from '@reusable-ui/accessibilities' // an accessibility management system

// reusable-ui features:
import {
    // hooks:
    usesAnimation,
}                           from '@reusable-ui/animation'       // animation stuff of UI



// hooks:

// states:

//#region disableable
export interface DisableableVars {
    filter : any
    anim   : any
}
const [disableableVars] = cssVars<DisableableVars>();

{
    const {animationRegistry: {registerFilter, registerAnim}} = usesAnimation();
    registerFilter(disableableVars.filter);
    registerAnim(disableableVars.anim);
}



// if all below are not set => enabled:
const selectorIfEnabled   = ':not(:is(.enabling, [aria-disabled]:not([aria-disabled="false"]), :disabled, .disabled))'
// .enabling will be added after loosing disable and will be removed after enabling-animation done:
const selectorIfEnabling  = '.enabling'
// [aria-disabled] = styled disable, :disabled = native disable:
const selectorIfDisabling = ':is([aria-disabled]:not([aria-disabled="false"]), :disabled):not(.disabled)'
// .disabled will be added after disabling-animation done:
const selectorIfDisabled  = '.disabled'

export const ifEnabled         = (styles: CssStyleCollection): CssRule => rule(selectorIfEnabled  , styles);
export const ifEnabling        = (styles: CssStyleCollection): CssRule => rule(selectorIfEnabling , styles);
export const ifDisabling       = (styles: CssStyleCollection): CssRule => rule(selectorIfDisabling, styles);
export const ifDisabled        = (styles: CssStyleCollection): CssRule => rule(selectorIfDisabled , styles);

export const ifEnable          = (styles: CssStyleCollection): CssRule => rule([selectorIfEnabling, selectorIfEnabled                                         ], styles);
export const ifDisable         = (styles: CssStyleCollection): CssRule => rule([                                       selectorIfDisabling, selectorIfDisabled], styles);
export const ifEnablingDisable = (styles: CssStyleCollection): CssRule => rule([selectorIfEnabling,                    selectorIfDisabling, selectorIfDisabled], styles);



export interface DisableableStuff { disableableRule: Factory<CssRule>, disableableVars: CssVars<DisableableVars> }
export interface DisableableConfig {
    filterDisable ?: CssKnownProps['filter'   ]
    
    animEnable    ?: CssKnownProps['animation']
    animDisable   ?: CssKnownProps['animation']
}
/**
 * Adds a capability of UI to be disabled.
 * @param config  A configuration of `disableableRule`.
 * @returns A `DisableableStuff` represents a disableable state.
 */
export const usesDisableable = (config?: DisableableConfig): DisableableStuff => {
    return {
        disableableRule: () => style({
            ...states([
                ifEnabling({
                    ...vars({
                        [disableableVars.filter] : config?.filterDisable,
                        [disableableVars.anim  ] : config?.animEnable,
                    }),
                }),
                ifDisabling({
                    ...vars({
                        [disableableVars.filter] : config?.filterDisable,
                        [disableableVars.anim  ] : config?.animDisable,
                    }),
                }),
                ifDisabled({
                    ...vars({
                        [disableableVars.filter] : config?.filterDisable,
                    }),
                }),
            ]),
        }),
        disableableVars,
    };
};



export interface DisableableProps
    extends
        // states:
        Partial<Pick<AccessibilityProps, 'enabled'|'inheritEnabled'>>
{
}

const htmlCtrls = [
    'button',
    'fieldset',
    'input',
    'select',
    'optgroup',
    'option',
    'textarea',
];
export const useDisableable = <TElement extends Element = HTMLElement>(props: DisableableProps & SemanticProps) => {
    // fn props:
    const propEnabled = usePropEnabled(props);
    const {tag}       = useSemantic(props);
    
    
    
    // states:
    const [enabled,   setEnabled  ] = useState<boolean>(propEnabled); // true => enabled, false => disabled
    const [animating, setAnimating] = useState<boolean|null>(null);   // null => no-animation, true => enabling-animation, false => disabling-animation
    
    
    
    /*
     * state is enabled/disabled based on [controllable enabled]
     * [uncontrollable enabled] is not supported
     */
    const enabledFn : boolean = propEnabled /*controllable*/;
    
    if (enabled !== enabledFn) { // change detected => apply the change & start animating
        setEnabled(enabledFn);   // remember the last change
        setAnimating(enabledFn); // start enabling-animation/disabling-animation
    } // if
    
    
    
    // handlers:
    const handleAnimationEnd = useEvent<React.AnimationEventHandler<TElement>>((event) => {
        // conditions:
        if (event.target !== event.currentTarget) return; // ignores bubbling
        if (!/((?<![a-z])(enable|disable)|(?<=[a-z])(Enable|Disable))(?![a-z])/.test(event.animationName)) return; // ignores animation other than (enable|disable)[Foo] or boo(Enable|Disable)[Foo]
        
        
        
        // clean up finished animation
        
        setAnimating(null); // stop enabling-animation/disabling-animation
    }, []);
    
    
    
    return {
        enabled  : enabled,
        disabled : !enabled,
        
        class    : ((): string|null => {
            // enabling:
            if (animating === true)  return 'enabling';
            
            // disabling:
            if (animating === false) return null; // uses :disabled or [aria-disabled]
            
            // fully disabled:
            if (!enabled) return 'disabled';
            
            // fully enabled:
            return null;
        })(),
        
        props    : (() => {
            if (enabled) return null;
            
            // use :disabled if <control>:
            if (tag && htmlCtrls.includes(tag)) return { disabled: true };
            
            // else, use [aria-disabled]:
            return { 'aria-disabled' : true };
        })(),
        
        handleAnimationEnd,
    };
};
//#endregion disableable
