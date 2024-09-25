// cssfn:
import {
    // writes css in javascript:
    rule,
    fallback,
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
    // removes browser's default stylesheet:
    stripoutList,
    stripoutScrollbar,
    stripoutMedia,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onContentStylesChange,
    ContentChildrenMediaOptions,
    usesContentChildrenMediaOptions,
    usesContentLayout,
    usesContentVariants,
}                           from '@reusable-ui/content'         // a base component

// internals:
import {
    // features:
    usesCarousel,
}                           from '../features/carousel.js'
import {
    // elements:
    listElm,
    dummyListElm,
    itemElm,
    prevBtnElm,
    nextBtnElm,
    navElm,
}                           from './elements.js'
import {
    // configs:
    carousels,
    cssCarouselConfig,
}                           from './config.js'



// styles:
export const onCarouselStylesChange = watchChanges(onContentStylesChange, cssCarouselConfig.onChange);



export const usesCarouselListLayout = (options?: ContentChildrenMediaOptions) => {
    // dependencies:
    
    // features:
    const {              paddingVars } = usesPadding(carousels);
    const {carouselRule, carouselVars} = usesCarousel();
    
    
    
    return style({
        // resets:
        ...stripoutList(),      // clear browser's default styles
        ...stripoutScrollbar(), // hide browser's scrollbar // TODO: uncomment
        
        
        
        // layouts:
        ...style({
            // layouts:
            gridArea       : '1 / 1 / -1 / -1', // fills the entire grid areas, from the first row/column to the last row/column
            display        : 'flex',            // use block flexbox, so it takes the entire parent's width
            flexDirection  : 'row',             // items are stacked horizontally
            justifyContent : 'start',           // items are placed starting from the left, so the first item is initially visible
            alignItems     : 'stretch',         // items height are follow the tallest one
            flexWrap       : 'nowrap',          // no wrapping, so the sliding works
            
            
            
            // positions:
            position       : 'relative', // (optional) makes calculating slide's offsetLeft/offsetTop faster
            
            
            
            // spacings:
            // cancel-out parent's padding with negative margin:
            marginInline   : `calc(0px - ${paddingVars.paddingInline} - (((${carouselVars.scrollMargin} - ${carouselVars.scrollMarginFr}) / (1 + (2 * ${carouselVars.scrollMarginFr}))) * 100%))`,
            marginBlock    : `calc(0px - ${paddingVars.paddingBlock})`,
            
            
            
            // scrolls:
            overflowX      : 'scroll',                  // enable horizontal scrolling
            // no need scroll snap anymore - we use js solution for scrolling
            // scrollSnapType : [['inline', 'mandatory']], // enable horizontal scroll snap
            // scrollBehavior : 'smooth',                  // smooth scrolling when it's triggered by the navigation or CSSOM scrolling APIs
            WebkitOverflowScrolling : 'touch',          // supports for iOS Safari
            
            // DON'T: causes the user cannot scroll the whole page on the top of <Carousel>
            // overscrollBehavior      : 'none',        // do not forward scroll action to the parent element
            
            // buggy on Chrome:
            touchAction    : 'pan-y pinch-zoom',        // no swipeLeft/swipeRight handling, we use our scroll implementation
            // workaround for the buggy with similar behavior:
            pointerEvents  : 'none',                    // prevents  user interaction (the interaction will be bubbled up to <parent> element)
            ...children(itemElm, {
                pointerEvents : 'auto',                 // preserves user interaction // cancel out *inherited* `pointerEvents`
            }),
            
            
            
            // children:
            ...children(itemElm, {
                // layouts:
                ...usesCarouselItemLayout(options),
            }),
            
            
            
            // customize:
            ...usesCssProps(usesPrefixedProps(carousels, 'list')), // apply config's cssProps starting with list***
        }),
        
        
        
        // features:
        ...carouselRule(), // must be placed at the last
    });
};

export const usesCarouselItemLayout = (options: ContentChildrenMediaOptions = {}) => {
    // options:
    const {
        mediaSelectorWithExcept,
    } = usesContentChildrenMediaOptions(options);
    
    
    
    // features:
    const {carouselVars} = usesCarousel();
    
    
    
    return style({
        // layouts:
        display         : 'flex',   // use block flexbox, so it takes the entire parent's width
        flexDirection   : 'column', // the flex direction to vert
        justifyContent  : 'center', // center items vertically
        alignItems      : 'center', // center items horizontally
        flexWrap        : 'nowrap', // no wrapping
        
        
        
        // sizes:
        flex            : [[0, 0, `calc(100% / (1 + (2 * ${carouselVars.scrollMargin})))`]], // ungrowable, unshrinkable, initial 100% parent's width
        // (important) force the media follow the <li> width, so it doesn't break the flex width:
        boxSizing       : 'border-box',                                                      // the final size is including borders & paddings
        inlineSize      : `calc(100% / (1 + (2 * ${carouselVars.scrollMargin})))`,           // fills the entire parent's width
        
        
        
        // scrolls:
        scrollSnapAlign : 'center', // put a magnet at the center
        scrollSnapStop  : 'normal', // scrolls one by one or multiple at once
        
        
        
        // children:
        ...children(mediaSelectorWithExcept, {
            // layouts:
            ...usesCarouselMediaLayout(),
        }),
        
        
        
        // customize:
        ...usesCssProps(usesPrefixedProps(carousels, 'item')), // apply config's cssProps starting with item***
    });
};

export const usesCarouselMediaLayout = () => {
    return style({
        // resets:
        ...stripoutMedia(), // removes browser's default styling on image
        
        
        
        // layouts:
        ...style({
            // layouts:
            ...rule(':where(:first-child:last-child)', { // only one child
                // sizes:
                // span to maximum width/height while keeps aspect-ratio:
                boxSizing         : 'border-box', // the final size is including borders & paddings
                maxInlineSize     : 'fill-available',
                maxBlockSize      : 'fill-available',
                ...fallback({
                    maxInlineSize : '-webkit-fill-available',
                    maxBlockSize  : '-webkit-fill-available',
                }),
                ...fallback({
                    maxInlineSize : '-moz-available',
                    maxBlockSize  : '-moz-available',
                }),
                ...fallback({
                    maxInlineSize : '100%',
                    maxBlockSize  : '100%',
                }),
                inlineSize        : 'auto',
                blockSize         : 'auto',
            }),
            
            
            
            // sizes:
            flex                  : [[0, 1, 'auto']], // ungrowable, shrinkable, initial from it's height
            minBlockSize          : 0, // workaround for Firefox bug 
            
            
            
            // customize:
            ...usesCssProps(usesPrefixedProps(carousels, 'media')), // apply config's cssProps starting with media***
        }),
    });
};



export const usesNavBtnLayout = () => {
    return style({
        // customize:
        ...usesCssProps(usesPrefixedProps(carousels, 'navBtn')), // apply config's cssProps starting with navBtn***
    });
};

export const usesPrevBtnLayout = () => {
    return style({
        // layouts:
        gridArea : 'prevBtn',
        
        
        
        // customize:
        ...usesCssProps(usesPrefixedProps(carousels, 'prevBtn')), // apply config's cssProps starting with prevBtn***
    });
};

export const usesNextBtnLayout = () => {
    return style({
        // layouts:
        gridArea : 'nextBtn',
        
        
        
        // customize:
        ...usesCssProps(usesPrefixedProps(carousels, 'nextBtn')), // apply config's cssProps starting with nextBtn***
    });
};



export const usesNavLayout = () => {
    return style({
        // layouts:
        gridArea    : 'nav',
        
        
        
        // sizes:
        justifySelf : 'center', // do not stretch the nav, just place it at the center horizontally
        
        
        
        // customize:
        ...usesCssProps(usesPrefixedProps(carousels, 'nav')), // apply config's cssProps starting with nav***
    });
};



export const usesCarouselLayout = (options?: ContentChildrenMediaOptions) => {
    // dependencies:
    
    // features:
    const {paddingRule, paddingVars} = usesPadding(carousels);
    
    
    
    return style({
        // layouts:
        ...usesContentLayout(),
        ...style({
            // layouts:
            display      : 'grid', // use css grid for layouting, so we can customize the desired area later.
            
            // explicit areas:
            gridTemplate : [[
                '"prevBtn main nextBtn" 1fr',
                '"prevBtn nav  nextBtn" min-content',
                '/',
                '   15%   1fr    15%'
            ]],
            
            // child default sizes:
            justifyItems : 'stretch', // each section fills the entire area's width
            alignItems   : 'stretch', // each section fills the entire area's height
            
            
            
            // borders:
            overflow     : 'hidden', // clip the children at the rounded corners
            
            
            
            // children:
            ...children(listElm, {
                // layouts:
                ...usesCarouselListLayout(options),
            }),
            ...children(dummyListElm, {
                // appearances:
             // visibility : 'hidden', // causing onScroll doesn't work in Firefox
                opacity    : 0,
                position   : 'relative',
                zIndex     : -1,
                // children:
                ...children('*', {
                    flex            : [[0, 0, 'calc(100% / 1)']],
                    inlineSize      : 'calc(100% / 1)',
                }),
            }),
            
            ...children([prevBtnElm, nextBtnElm], {
                // layouts:
                ...usesNavBtnLayout(),
            }),
            ...children(prevBtnElm, {
                // layouts:
                ...usesPrevBtnLayout(),
            }),
            ...children(nextBtnElm, {
                // layouts:
                ...usesNextBtnLayout(),
            }),
            
            ...children(navElm, {
                // layouts:
                ...usesNavLayout(),
            }),
            
            
            
            // customize:
            ...usesCssProps(carousels), // apply config's cssProps
            
            
            
            // spacings:
         // padding       : paddingVars.padding,
            paddingInline : paddingVars.paddingInline,
            paddingBlock  : paddingVars.paddingBlock,
        }),
        
        
        
        // features:
        ...paddingRule(), // must be placed at the last
    });
};

export const usesCarouselVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(carousels);
    
    
    
    return style({
        // variants:
        ...usesContentVariants(),
        ...resizableRule(),
    });
};

export default () => style({
    // layouts:
    ...usesCarouselLayout(),
    
    // variants:
    ...usesCarouselVariants(),
});
