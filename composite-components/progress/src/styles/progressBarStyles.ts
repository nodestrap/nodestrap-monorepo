// cssfn:
import {
    // cssfn css specific types:
    CssStyleCollection,
    
    
    
    // writes css in javascript:
    rule,
    variants,
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    usesPrefixedProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // background stuff of UI:
    usesBackground,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // a capability of UI to rotate its layout:
    OrientationableOptions,
    usesOrientationable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onBasicStylesChange,
    usesBasicLayout,
}                           from '@reusable-ui/basic'           // a base component
import {
    // styles:
    listItemElm,
}                           from '@reusable-ui/list'            // represents a series of content

// internals:
import {
    // defaults:
    defaultOrientationableOptions,
}                           from '../defaults.js'
import {
    // features:
    usesProgressBar,
}                           from '../features/progressBar.js'
import {
    // states:
    usesRunnable,
}                           from '../states/runnable.js'
import {
    // configs:
    progresses,
    cssProgressConfig,
}                           from './config.js'



// styles:
export const onProgressBarStylesChange = watchChanges(onBasicStylesChange, cssProgressConfig.onChange);

export const usesProgressBarLayout = (options?: OrientationableOptions) => {
    // options:
    const orientationableStuff = usesOrientationable(options, defaultOrientationableOptions);
    const {orientationInlineSelector, orientationBlockSelector} = orientationableStuff;
    const parentOrientationInlineSelector = `${orientationInlineSelector}&`;
    const parentOrientationBlockSelector  = `${orientationBlockSelector }&`;
    const ifParentOrientationInline       = (styles: CssStyleCollection) => rule(parentOrientationInlineSelector, styles);
    const ifParentOrientationBlock        = (styles: CssStyleCollection) => rule(parentOrientationBlockSelector , styles);
    
    
    
    // dependencies:
    
    // features:
    const {                 borderVars     } = usesBorder();
    const {progressBarRule, progressBarVars} = usesProgressBar();
    
    // borders:
    const negativeBorderWidth = `calc(0px - ${borderVars.borderWidth})`;
    
    
    
    return style({
        // sizes:
        flex     : [[progressBarVars.valueRatio, progressBarVars.valueRatio, 0]], // growable, shrinkable, initial from 0 width; using `valueRatio` for the grow/shrink ratio
        overflow : 'hidden',
        
        
        
        // borders:
        ...ifParentOrientationInline({ // inline
            ...rule(':first-child', {
                marginInlineStart : negativeBorderWidth,
            }),
            ...rule(':last-child', {
                marginInlineEnd   : negativeBorderWidth,
            }),
        }),
        ...ifParentOrientationBlock({  // block
            ...rule(':first-child', {
                marginBlockStart  : negativeBorderWidth,
            }),
            ...rule(':last-child', {
                marginBlockEnd    : negativeBorderWidth,
            }),
        }),
        
        
        
        // children:
        ...children(listItemElm, {
            // layouts:
            ...usesBasicLayout(),
            ...style({
                // layouts:
                display        : 'flex',   // fills the entire wrapper's width
                flexDirection  : 'row',    // items are stacked horizontally
                justifyContent : 'center', // center items (text, icon, etc) horizontally
                alignItems     : 'center', // center items (text, icon, etc) vertically
                flexWrap       : 'nowrap', // no wrapping
                
                
                
                // borders:
                [borderVars.borderWidth           ] : '0px', // discard border
                // remove rounded corners on top:
                [borderVars.borderStartStartRadius] : '0px',
                [borderVars.borderStartEndRadius  ] : '0px',
                // remove rounded corners on bottom:
                [borderVars.borderEndStartRadius  ] : '0px',
                [borderVars.borderEndEndRadius    ] : '0px',
                
                
                
                // sizes:
                flex : [[1, 1, 'auto']], // growable, shrinkable, initial from it's height (for variant `.oBlock`) or width (for variant `.oInline`)
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(progresses, 'bar')), // apply config's cssProps starting with bar***
            }),
            
            
            
            // features:
            ...progressBarRule(), // must be placed at the last
        }),
    });
};

export const usesProgressBarVariants = () => {
    // dependencies:
    
    // features:
    const {backgroundVars} = usesBackground();
    
    
    
    return style({
        ...variants([
            rule('.striped', {
                // children:
                ...children(listItemElm, {
                    // backgrounds:
                    backg : [
                        // layering: backg1 | backg2 | backg3 ...
                        
                        // top layer:
                        `${progresses.barBackgStripedImg} left/${progresses.barBackgStripedWidth} ${progresses.barBackgStripedHeight}`,
                        
                        // bottom layer:
                        backgroundVars.backg,
                    ],
                    backgroundBlendMode : progresses.barBackgStripedBlendMode,
                }),
            }),
        ]),
    });
};

export const usesProgressBarStates = () => {
    // dependencies:
    
    // states:
    const {runnableRule, runnableVars} = usesRunnable(progresses);
    
    
    
    return style({
        // states:
        ...runnableRule(),
        ...style({
            // children:
            ...children(listItemElm, {
                // animations:
                anim  : runnableVars.anim,
            }),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesProgressBarLayout(),
    
    // variants:
    ...usesProgressBarVariants(),
    
    // states:
    ...usesProgressBarStates(),
});
