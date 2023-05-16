// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// configs:
export const [buttons, buttonValues, cssButtonConfig] = cssConfig(() => {
    const bases = {
        // spacings:
        gapInlineSm        : spacers.xs         as CssKnownProps['gapInline' ],
        gapBlockSm         : spacers.xs         as CssKnownProps['gapBlock'  ],
        gapInlineMd        : spacers.sm         as CssKnownProps['gapInline' ],
        gapBlockMd         : spacers.sm         as CssKnownProps['gapBlock'  ],
        gapInlineLg        : spacers.md         as CssKnownProps['gapInline' ],
        gapBlockLg         : spacers.md         as CssKnownProps['gapBlock'  ],
        
        
        
        // typos:
        whiteSpace         : 'normal'           as CssKnownProps['whiteSpace'],
        
        
        
        // ghost style:
        ghostOpacity       : 0.5                as CssKnownProps['opacity'   ],
        ghostOpacityArrive : 1                  as CssKnownProps['opacity'   ],
    };
    
    
    
    const defaults = {
        // spacings:
        gapInline          : bases.gapInlineMd  as CssKnownProps['gapInline' ],
        gapBlock           : bases.gapBlockMd   as CssKnownProps['gapBlock'  ],
    };
    
    
    
    return {
        ...bases,
        ...defaults,
    };
}, { prefix: 'btn' });
