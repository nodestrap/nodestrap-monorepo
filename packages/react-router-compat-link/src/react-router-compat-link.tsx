// react:
import {
    // react:
    default as React,
}                           from 'react'

// react router:
import {
    // hooks:
    useHref,
}                           from 'react-router'
import {
    // types:
    LinkProps as BaseLinkProps,
    
    
    
    // hooks:
    useLinkClickHandler,
}                           from 'react-router-dom'



export interface LinkProps extends BaseLinkProps
{
    // react router links:
    component ?: React.ReactElement
    passHref  ?: boolean
}

/**
 * The public API for rendering a history-aware <a>.
 *
 * @see https://reactrouter.com/docs/en/v6/components/link
 */
const Link = React.forwardRef(function LinkWithRef(props: LinkProps, ref: React.ForwardedRef<HTMLAnchorElement>): JSX.Element|null {
    // rest props:
    const {
        // react router links:
        reloadDocument = false,
        replace        = false,
        state,
        to,
        
        component      = undefined,
        passHref       = false,
        
        
        
        // links:
        target,
    ...restAnchorProps} = props;
    
    
    
    // fn props:
    const href = useHref(to);
    
    
    
    // handlers:
    const clientSideHandleClick = useLinkClickHandler(to, { replace, state, target });
    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        props.onClick?.(e); // keeps the original onClick on <Link onClick={...} />
        
        if (!e.defaultPrevented && !reloadDocument) {
            clientSideHandleClick(e);
        } // if
    };
    
    
    
    // jsx:
    if (component) {
        return React.cloneElement(component, {
            // essentials:
            ref,
            
            
            
            // links:
            ...(passHref ? {
                href,
                target,
            } : {}),
            
            
            
            // events:
            onClick: ((e) => {
                component.props.onClick?.(e); // keeps the original onClick on <FooComponent onClick={...} />
                
                handleClick(e);
            }) as React.MouseEventHandler<HTMLAnchorElement>,
        });
    }
    else {
        return (
            // eslint-disable-next-line jsx-a11y/anchor-has-content
            <a
                // other props:
                {...restAnchorProps}
                
                
                
                // essentials:
                ref={ref}
                
                
                
                // links:
                href={href}
                target={target}
                
                
                
                // events:
                onClick={handleClick}
            />
        );
    } // if
});
export {
    Link,
    Link as default,
}
