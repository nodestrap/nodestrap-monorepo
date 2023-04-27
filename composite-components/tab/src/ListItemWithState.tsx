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
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import type {
    // react components:
    ListItemProps,
    
    ListItemComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content

// internals:
import {
    // states:
    TabExpandedChangeEvent,
    useTabState,
}                           from './states/tabState.js'



// react components:
export interface ListItemWithStateProps<TElement extends Element = HTMLElement, TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>
    extends
        // bases:
        Omit<ListItemProps<TElement>, 'tabIndex'>,
        
        // positions:
        Pick<TTabExpandedChangeEvent, 'tabIndex'>,
        
        // components:
        Required<ListItemComponentProps<TElement>>
{
}
export const ListItemWithState = <TElement extends Element = HTMLElement, TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>(props: ListItemWithStateProps<TElement, TTabExpandedChangeEvent>): JSX.Element|null => {
    // rest props:
    const {
        // positions:
        tabIndex,
        
        
        
        // components:
        listItemComponent,
    ...restListItemProps} = props;
    
    
    
    // states:
    const {
        // states:
        expandedTabIndex,
        triggerExpandedChange,
    } = useTabState();
    const isActive = (expandedTabIndex === tabIndex);
    
    
    
    // handlers:
    const handleListItemClickInternal = useEvent<React.MouseEventHandler<TElement>>(() => {
        triggerExpandedChange(tabIndex);
    });
    const handleListItemClick         = useMergeEvents(
        // preserves the original `onClick` from `listItemComponent`:
        listItemComponent.props.onClick,
        
        
        
        // preserves the original `onClick` from `props`:
        props.onClick,
        
        
        
        // actions:
        handleListItemClickInternal,
    );
    
    
    
    // jsx:
    /* <ListItem> */
    return React.cloneElement<ListItemProps<TElement>>(listItemComponent,
        // props:
        {
            // other props:
            ...restListItemProps,
            ...listItemComponent.props, // overwrites restListItemProps (if any conflics)
            
            
            
            // semantics:
            'aria-selected' : listItemComponent.props['aria-selected'] ?? props['aria-selected'] ??  isActive,
            
            
            
            // accessibilities:
            active          : listItemComponent.props.active           ?? props.active           ??  isActive,
            tabIndex        : listItemComponent.props.tabIndex      /* ?? props.tabIndex */      ?? (isActive ? 0 : -1),
            
            
            
            // handlers:
            onClick         : handleListItemClick,
        },
    );
};
