// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    useMergeRefs,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    ButtonProps,
    
    ButtonComponentProps,
}                           from '@reusable-ui/button'          // a button component for initiating an action



// react components:
export interface ButtonWithAnswerProps<TAnswer extends any = 'ok'>
    extends
        // bases:
        ButtonProps,
        
        // components:
        Required<Pick<ButtonComponentProps,
            'buttonComponent' // a required underlying <Button>
        >>
{
    // refs:
    autoFocusRef ?: React.Ref<HTMLButtonElement> // setter ref
    
    
    
    // contents:
    answer        : TAnswer
    
    
    
    // handlers:
    onAnswer      : (answer: TAnswer) => void
}
const ButtonWithAnswer = <TAnswer extends any = 'ok'>(props: ButtonWithAnswerProps<TAnswer>): JSX.Element|null => {
    // rest props:
    const {
        // refs:
        autoFocusRef,
        
        
        
        // contents:
        answer,
        
        
        
        // components:
        buttonComponent,
        
        
        
        // handlers:
        onAnswer,
    ...restButtonProps} = props;
    
    
    
    // refs:
    const mergedElmRef = useMergeRefs(
        // preserves the original `elmRef` from `buttonComponent`:
        buttonComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        props.elmRef,
    );
    
    
    
    // handlers:
    const handleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        event.preventDefault(); // handled
        
        
        
        // actions:
        onAnswer(answer);
    });
    const handleClick          = useMergeEvents(
        // preserves the original `onClick` from `buttonComponent`:
        buttonComponent.props.onClick,
        
        
        
        // preserves the original `onClick` from `props`:
        props.onClick,
        
        
        
        // actions:
        handleClickInternal,
    );
    
    
    
    // jsx:
    /* <Button> */
    return React.cloneElement<ButtonProps>(buttonComponent,
        // props:
        {
            // other props:
            ...restButtonProps,
            ...buttonComponent.props, // overwrites restButtonProps (if any conflics)
            
            
            
            // refs:
            elmRef  : mergedElmRef,
            
            
            
            // handlers:
            onClick : handleClick,
        },
    );
};
export {
    ButtonWithAnswer,
    ButtonWithAnswer as default,
};
