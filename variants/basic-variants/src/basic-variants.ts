// react:
import {
    // hooks:
    useMemo,
}                           from 'react'

// reusable-ui variants:
import {
    // hooks:
    ResizableProps,
}                           from '@reusable-ui/resizable'       // size options of UI
import {
    // hooks:
    ThemableProps,
}                           from '@reusable-ui/themable'        // color options of UI
import {
    // hooks:
    GradientableProps,
}                           from '@reusable-ui/gradientable'    // gradient variant of UI
import {
    // hooks:
    OutlineableProps,
}                           from '@reusable-ui/outlineable'     // outlined (background-less) variant of UI
import {
    // hooks:
    MildableProps,
}                           from '@reusable-ui/mildable'        // mild (soft color) variant of UI



// hooks:

// variants:

//#region basic-variants
export interface BasicVariantProps
    extends
        // bases:
        ResizableProps,
        ThemableProps,
        GradientableProps,
        OutlineableProps,
        MildableProps
{
}
export const useBasicVariantProps = (props: BasicVariantProps): BasicVariantProps => {
    const {
        size,
        theme,
        gradient,
        outlined,
        mild,
    } = props;
    
    
    
    const basicVariantProps : BasicVariantProps = {
        size,
        theme,
        gradient,
        outlined,
        mild,
    };
    return useMemo<BasicVariantProps>(() => Object.fromEntries(
        Object.entries(basicVariantProps)
        .filter(([, value]) => (value !== undefined)) // filter out `undefined` props so they wouldn't overwrite the existing ones
    ) as BasicVariantProps, [
        size,
        theme,
        gradient,
        outlined,
        mild,
    ]);
};
//#endregion basic-variants
