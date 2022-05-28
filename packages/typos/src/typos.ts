// cssfn:
import {
    // rules:
    atRoot,
    
    
    
    // scopes:
    globalScope,
    
    
    
    // style sheets:
    styleSheets,
}                           from '@cssfn/cssfn'         // writes css in javascript
import {
    createCssConfig,
    
    
    
    // utilities:
    usesCssProps,
}                           from '@cssfn/css-config'    // reads/writes css variables configuration

// reusable-ui:
import {
    // configs:
    colors,
}                           from '@reusable-ui/colors'  // a color management system

// internals:
import type {
    FontSize,
    FontFamily,
    FontWeight,
    FontStyle,
    TextDecoration,
    LineHeight,
    OverflowWrap,
    Foreground,
    Background,
}                           from './types.js'



//#region configs
const [typos, typoValues, cssTypoConfig] = createCssConfig(() => {
    const basics = {
        fontSizeNm           : '1rem'       as FontSize,
        
        fontFamilySansSerief : [
            'system-ui',
            '-apple-system',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            '"Noto Sans"',
            '"Liberation Sans"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Noto Color Emoji"',
        ]                                   as FontFamily,
        fontFamilyMonospace  : [
            'SFMono-Regular',
            'Menlo',
            'Monaco',
            'Consolas',
            '"Liberation Mono"',
            '"Courier New"',
            'monospace',
        ]                                   as FontFamily,
        
        fontWeightLighter    : 'lighter'    as FontWeight,
        fontWeightLight      : 300          as FontWeight,
        fontWeightNormal     : 400          as FontWeight,
        fontWeightSemibold   : 600          as FontWeight,
        fontWeightBold       : 700          as FontWeight,
        fontWeightBolder     : 'bolder'     as FontWeight,
        
        fontStyle            : 'normal'     as FontStyle,
        textDecoration       : 'none'       as TextDecoration,
        
        lineHeightSm         : 1.25         as LineHeight,
        lineHeightNm         : 1.50         as LineHeight,
        lineHeightLg         : 2.00         as LineHeight,
        
        overflowWrap         : 'break-word' as OverflowWrap,
        
        foreg                : colors.foreg as Foreground,
        /**
         * The default is a solid color of `colors.backg`.  
         * It can be an image or gradient with the average color of `colors.backg`.
         */
        backg                : colors.backg as Background,
    };
    
    return {
        ...basics,
        
        fontSizeXs           : [['calc(', basics.fontSizeNm, '*', 0.50  , ')']] as FontSize,
        fontSizeSm           : [['calc(', basics.fontSizeNm, '*', 0.75  , ')']] as FontSize,
        fontSize             :            basics.fontSizeNm                     as FontSize,
        fontSizeMd           : [['calc(', basics.fontSizeNm, '*', 1.25  , ')']] as FontSize,
        fontSizeLg           : [['calc(', basics.fontSizeNm, '*', 1.50  , ')']] as FontSize,
        fontSizeXl           : [['calc(', basics.fontSizeNm, '*', 1.75  , ')']] as FontSize,
        fontSizeXxl          : [['calc(', basics.fontSizeNm, '*', 2.00  , ')']] as FontSize,
        fontSizeXxxl         : [['calc(', basics.fontSizeNm, '*', 2.25  , ')']] as FontSize,
        
        fontFamily           : basics.fontFamilySansSerief                      as FontFamily,
        
        fontWeight           : basics.fontWeightNormal                          as FontWeight,
        
        lineHeight           : basics.lineHeightNm                              as LineHeight,
    };
}, { prefix: '' });
export {
    typos,
    typos as cssProps,
    typos as default,
}
export {
    typoValues,
    typoValues as cssVals,
}
export {
    cssTypoConfig,
    cssTypoConfig as cssConfig,
}
//#endregion configs



//#region style sheets
styleSheets([
    globalScope({
        ...atRoot({
            // customize:
            ...usesCssProps(typos),
        }),
    }),
]);
//#endregion style sheets
