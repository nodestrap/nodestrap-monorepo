// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// cssfn:
import type {
    // cssfn properties:
    CssRule,
    
    CssStyleCollection,
}                           from '@cssfn/css-types'             // cssfn css specific types
import {
    // rules:
    rule,
}                           from '@cssfn/cssfn'                 // writes css in javascript
import {
    // utilities:
    cssVar,
}                           from '@cssfn/css-var'               // strongly typed of css variables

// reusable-ui:
import {
    // hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/hooks'           // react helper hooks
import {
    // types:
    SemanticProps,
    useSemantic,
}                           from '@reusable-ui/generic'         // a base component
import {
    // hooks:
    usesAnim,
}                           from '@reusable-ui/basic'           // a base component



// hooks:

// accessibilities:

//#region expandable
export interface ExpandCollapseVars {
    filter : any
    anim   : any
}
const [expands] = cssVar<ExpandCollapseVars>();

{
    const [, , animRegistry] = usesAnim();
    animRegistry.registerFilter(expands.filter);
    animRegistry.registerAnim(expands.anim);
}



// .expanded will be added after expanding-animation done:
const selectorIfExpanded   = '.expanded'
// .expanding = styled expand, [open] = native expand:
const selectorIfExpanding  = ':is(.expanding, [open]):not(.expanded)'
// .collapsing will be added after loosing expand and will be removed after collapsing-animation done:
const selectorIfCollapsing = '.collapsing'
// if all above are not set => collapsed:
const selectorIfCollapsed  = ':not(:is(.expanded, .expanding, [open], .collapsing))'



export const ifExpanded          = (styles: CssStyleCollection): CssRule => rule(selectorIfExpanded  , styles);
export const ifExpanding         = (styles: CssStyleCollection): CssRule => rule(selectorIfExpanding , styles);
export const ifCollapsing        = (styles: CssStyleCollection): CssRule => rule(selectorIfCollapsing, styles);
export const ifCollapsed         = (styles: CssStyleCollection): CssRule => rule(selectorIfCollapsed , styles);

export const ifExpand            = (styles: CssStyleCollection): CssRule => rule([selectorIfExpanding, selectorIfExpanded                                           ], styles);
export const ifCollapse          = (styles: CssStyleCollection): CssRule => rule([                                         selectorIfCollapsing, selectorIfCollapsed], styles);
export const ifExpandCollapsing  = (styles: CssStyleCollection): CssRule => rule([selectorIfExpanding, selectorIfExpanded, selectorIfCollapsing                     ], styles);
export const ifExpandingCollapse = (styles: CssStyleCollection): CssRule => rule([selectorIfExpanding,                     selectorIfCollapsing, selectorIfCollapsed], styles);



export interface ExpandChangeEvent {
    expand: boolean
}
export interface ExpandableProps<TExpandChangeEvent extends ExpandChangeEvent = ExpandChangeEvent>
    extends
        Partial<Pick<TExpandChangeEvent, 'expand'>>
{
    onExpandChange ?: EventHandler<TExpandChangeEvent>
}

const expandableCtrls = [
    'dialog',
    'details',
];
export const useExpandCollapseState = <TElement extends Element = HTMLElement, TExpandChangeEvent extends ExpandChangeEvent = ExpandChangeEvent>(props: ExpandableProps<TExpandChangeEvent> & SemanticProps) => {
    // fn props:
    const expand  = props.expand ?? false;
    const { tag } = useSemantic(props);
    
    
    
    // states:
    const [expanded,  setExpanded ] = useState<boolean>(expand);    // true => expand, false => collapse
    const [animating, setAnimating] = useState<boolean|null>(null); // null => no-animation, true => expanding-animation, false => collapsing-animation
    
    
    
    /*
     * state is expand/collapse based on [controllable expand]
     * [uncontrollable expand] is not supported
     */
    const expandFn : boolean = expand /*controllable*/;
    
    if (expanded !== expandFn) { // change detected => apply the change & start animating
        setExpanded(expandFn);   // remember the last change
        setAnimating(expandFn);  // start expanding-animation/collapsing-animation
    } // if
    
    
    
    // handlers:
    const handleAnimationEnd = useEvent<React.AnimationEventHandler<TElement>>((event) => {
        // conditions:
        if (event.target !== event.currentTarget) return; // ignores bubbling
        if (!/((?<![a-z])(expand|collapse)|(?<=[a-z])(Expand|Collapse))(?![a-z])/.test(event.animationName)) return; // ignores animation other than (expand|collapse)[Foo] or boo(Expand|Collapse)[Foo]
        
        
        
        // clean up finished animation
        
        setAnimating(null); // stop expanding-animation/collapsing-animation
    }, []);
    
    
    
    return {
        expand    : expanded,
        isVisible : expanded || (animating !== null),
        
        class     : ((): string|null => {
            // expanding:
            if (animating === true) {
                if (tag && expandableCtrls.includes(tag)) return null; // uses [open]
                return 'expanding';
            } // if
            
            // collapsing:
            if (animating === false) return 'collapsing';
            
            // fully expanded:
            if (expanded) return 'expanded';
            
            // fully collapsed:
            return null;
        })(),
        
        props     : (() => {
            if (!expanded) return null;
            
            // use [open] if <dialog> or <details>:
            if (tag && expandableCtrls.includes(tag)) return { open: true };
            
            // else, use .expanding or .expanded which already defined in `class`:
            return null;
        })(),
        
        handleAnimationEnd,
    };
};
//#endregion expandable
