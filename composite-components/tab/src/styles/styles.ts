// cssfn:
import {
    // writes css in javascript:
    rule,
    variants,
    states,
    children,
    style,
    vars,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    usesPrefixedProps,
    usesSuffixedProps,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
    
    
    
    // outlined (background-less) variant of UI
    ifOutlined,
    usesOutlineable,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ifCollapsed,
    usesCollapsible,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    basics,
}                           from '@reusable-ui/basic'           // a base component
import {
    // elements:
    wrapperElm,
    listItemElm,
}                           from '@reusable-ui/list'            // represents a series of content

// internals:
import {
    // features:
    usesTab,
}                           from '../features/tab.js'
import {
    // elements:
    tabHeaderElm,
    tabBodyElm,
    tabPanelElm,
}                           from './elements.js'
import {
    // configs:
    tabs,
}                           from './config.js'



export const usesTabHeaderLayout = () => {
    return style({
        // sizes:
        flex         : [[0, 0, 'auto']], // ungrowable, unshrinkable, initial from it's height
    });
}
export const usesTabHeaderVariants = () => {
    // dependencies:
    
    // features:
    const {borderVars     } = usesBorder();
    
    // variants:
    const {outlineableVars} = usesOutlineable();
    
    
    
    return style({
        // variants:
        ...variants([
            ifOutlined({
                // children:
                ...children(wrapperElm, {
                    // children:
                    ...children(listItemElm, {
                        ...rule(':nth-child(n)', { // increase the specificity to override <ListItem>
                            // borders:
                            // when outlined: a small color tweak: match <TabHeader>'s borderColor to <TabBody>'s borderColor
                            [borderVars.borderColor] : outlineableVars.foregFn,
                        }),
                    }),
                }),
            }),
        ]),
    });
};

export const usesTabPanelLayout = () => {
    // dependencies:
    
    // features:
    // inefficient: just for single animation:
    // const {animationRule, animationVars} = usesAnimation();
    
    // capabilities:
    const {groupableVars   } = usesGroupable();
    
    // more efficient:
    // states:
    const {collapsibleVars } = usesCollapsible();
    
    // features:
    const {tabRule, tabVars} = usesTab({
        panelSize : `calc(100% + (${groupableVars.paddingInline} * 2))`,
    });
    
    
    
    return style({
        // features:
        ...tabRule(),
        
        
        
        // layouts:
        ...style({
            // positions:
            gridArea         : '1/1/1/1', // the options are overlapping each other, so the parent takes the maximum width & height of children
            
            // stack the <TabPanel>(s) horizontally -- without changing the <TabBody>'s width:
            position         : 'relative',
            insetInlineStart : tabVars.currentTabPosition,
            
            
            
            // scrolls:
            overflow         : 'auto', // enable horz & vert scrolling
            
            
            
            // spacings:
            marginInline     : `calc(0px - ${groupableVars.paddingInline})`, // cancel out parent's padding with negative margin
            marginBlock      : `calc(0px - ${groupableVars.paddingBlock })`, // cancel out parent's padding with negative margin
            paddingInline    : groupableVars.paddingInline,                  // restore parent's padding with positive margin
            paddingBlock     : groupableVars.paddingBlock,                   // restore parent's padding with positive margin
            
            
            
            // customize:
            ...usesCssProps(usesPrefixedProps(tabs, 'panel')), // apply config's cssProps starting with panel***
            
            
            
            // animations:
         // anim             : animationVars.anim,   // inefficient: just for single animation
            anim             : collapsibleVars.anim, // more efficient
        }),
        
        
        
        // features:
        // inefficient: just for single animation:
        // ...animationRule(), // must be placed at the last
    });
};

export const usesTabBodyLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    // capabilities:
    const {groupableRule} = usesGroupable({
        orientationInlineSelector : null, // never
        orientationBlockSelector  : null, // never
        itemsSelector             : null, // never
    });
    
    
    
    return style({
        // capabilities:
        ...groupableRule(), // supports for <TabPanel>'s negative margin
        
        
        
        // layouts:
        ...style({
            // layouts:
            display      : 'grid',
            justifyItems : 'stretch', // overlaps each <TabPanel> to anothers
            alignItems   : 'stretch', // overlaps each <TabPanel> to anothers
            
            
            
            // sizes:
            flex         : [[1, 1, 'auto']], // growable, shrinkable, initial from it's height
            
            
            
            // scrolls:
            overflow     : 'hidden', // force <TabPanel> to activate the `overflow: 'auto'`
            
            
            
            // borders:
            ...rule(':not(:first-child)', {
                [borderVars.borderStartStartRadius] : '0px', // remove top radius
                [borderVars.borderStartEndRadius  ] : '0px', // remove top radius
                borderBlockStartWidth               : '0px', // remove top border (already applied by <Tab>)
            }),
            
            
            
            // children:
            ...children(tabPanelElm, usesTabPanelLayout()),
            
            
            
            // customize:
            ...usesCssProps(usesPrefixedProps(tabs, 'body')), // apply config's cssProps starting with body***
        }),
    });
};
export const usesTabBodyVariants = () => {
    return style({
        // variants:
        ...variants([
            rule('.maxContent', {
                // children:
                ...children(tabPanelElm, {
                    // states:
                    ...usesCollapsible(usesSuffixedProps(usesPrefixedProps(tabs, 'panel'), 'maxContent')).collapsibleRule(), // overwrites {panel}PropName = {panel}PropName{MaxContent}
                }),
            }),
            rule('.fitContent', {
                // children:
                ...children(tabPanelElm, {
                    // states:
                    ...usesCollapsible(usesSuffixedProps(usesPrefixedProps(tabs, 'panel'), 'fitContent')).collapsibleRule(), // overwrites {panel}PropName = {panel}PropName{FitContent}
                    ...states([
                        ifCollapsed({
                            // sizes:
                            // remove the height while maintaining it's width:
                            maxBlockSize : 0,        // the *grid* of <TabBody> will adjust to the highest of <TabPanel>(s)
                         // overflowY    : 'hidden', // the *grid* of <TabBody> will adjust to the highest of <TabPanel>(s)
                        }),
                    ]),
                }),
            }),
        ]),
    });
};

export const usesTabLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars   } = usesBorder();
    const {paddingVars  } = usesPadding();
    
    // capabilities:
    const {groupableRule} = usesGroupable({
        orientationInlineSelector : null, // never  => the <TabHeader> & <TabBody> are never  stacked in horizontal
        orientationBlockSelector  : '&',  // always => the <TabHeader> & <TabBody> are always stacked in vertical
        itemsSelector             : ':nth-child(n)', // select <TabHeader> & <TabBody>
    });
    
    
    
    return style({
        // capabilities:
        ...groupableRule(), // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // layouts:
            display        : 'flex',
            flexDirection  : 'column',
            justifyContent : 'stretch',
            alignItems     : 'stretch',
            flexWrap       : 'nowrap',
            
            
            
            // children:
            ...children(tabHeaderElm, style({
                // layouts:
                ...usesTabHeaderLayout(),
                
                // variants:
                ...usesTabHeaderVariants()
            })),
            ...children(tabBodyElm, style({
                // layouts:
                ...usesTabBodyLayout(),
                
                // variants:
                ...usesTabBodyVariants(),
            })),
            
            
            
            // borders:
            borderWidth            : borderVars.borderWidth, // needs a borderWidth for influenting <TabBody>'s borderRadius
         // borderRadius           : borderVars.borderRadius,
            borderStartStartRadius : borderVars.borderStartStartRadius,
            borderStartEndRadius   : borderVars.borderStartEndRadius,
            borderEndStartRadius   : borderVars.borderEndStartRadius,
            borderEndEndRadius     : borderVars.borderEndEndRadius,
            
            
            
            // spacings:
         // padding                : paddingVars.padding,
            paddingInline          : paddingVars.paddingInline,
            paddingBlock           : paddingVars.paddingBlock,
            
            
            
            // customize:
            ...usesCssProps(tabs), // apply config's cssProps
        }),
        
        
        
        // features:
        
        // use manually applying `borderRule` feature to avoid useless `borderVars.borderColorFn` & `borderVars.borderColor`
     // ...borderRule(),  // must be placed at the last
        
        // manually applying `borderRule` feature:
        ...vars({
            // borders:
            [borderVars.borderWidth           ] : '0px', // needs a borderWidth for influenting <TabBody>'s borderRadius
            [borderVars.borderStartStartRadius] : basics.borderRadius,
            [borderVars.borderStartEndRadius  ] : basics.borderRadius,
            [borderVars.borderEndStartRadius  ] : basics.borderRadius,
            [borderVars.borderEndEndRadius    ] : basics.borderRadius,
        }),
        
        // use manually applying `paddingRule` feature to avoid useless `paddingVars.padding`
     // ...paddingRule(), // must be placed at the last
        
        // manually applying `paddingRule` feature:
        ...vars({
            // spacings:
            [paddingVars.paddingInline        ] : '0px',
            [paddingVars.paddingBlock         ] : '0px',
        }),
    });
};

export default () => style({
    // layouts:
    ...usesTabLayout(),
});
