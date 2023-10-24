// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeEvents,
    useMergeClasses,
    
    
    
    // an accessibility management system:
    AccessibilityProps,
    AccessibilityProvider,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    CollapsibleProps,
    useCollapsible,
    CollapsibleEventProps,
    useCollapsibleEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    GenericProps,
    Generic,
}                           from '@reusable-ui/generic'         // a base component

// internals:
import {
    // states:
    TabExpandedChangeEvent,
    useTabState,
}                           from './states/tabState.js'



// react components:
export interface TabPanelProps<TElement extends Element = HTMLElement, TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>
    extends
        // bases:
        GenericProps<TElement>,
        
        // accessibilities:
        Pick<AccessibilityProps,
            // states:
            |'enabled'
            |'inheritEnabled'
        >,
        
        // states:
        CollapsibleProps<TTabExpandedChangeEvent>,
        CollapsibleEventProps
{
    // accessibilities:
    label          ?: React.ReactNode
    
    
    
    // behaviors:
    lazy           ?: boolean
    
    
    
    // states:
    expanded       ?: boolean
    
    
    
    // components:
    panelComponent ?: React.ReactComponentElement<any, GenericProps<TElement>>
    
    
    
    // children:
    children       ?: React.ReactNode
}
const TabPanel = <TElement extends Element = HTMLElement, TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>(props: TabPanelProps<TElement, TTabExpandedChangeEvent>): JSX.Element|null => {
    // states:
    const collapsibleState = useCollapsible<TElement, TTabExpandedChangeEvent>(props);
    const isVisible        = collapsibleState.isVisible; // visible = showing, shown, hidding ; !visible = hidden
    
    useCollapsibleEvent<TElement>(props, collapsibleState);
    
    const {
        // behaviors:
        defaultLazy,
        
        
        
        // data:
        tabPanelStyle,
    } = useTabState();
    
    
    
    // rest props:
    const {
        // accessibilities:
        label           : _label, // not used here, used by <TabHeader>|<TabBody>
        
        
        
        // behaviors:
        lazy            = defaultLazy ?? false,
        
        
        
        // states:
        enabled         : enabled,          // take, to be handled by `<AccessibilityProvider>`
        inheritEnabled  : inheritEnabled,   // take, to be handled by `<AccessibilityProvider>`
        
        expanded        : _expanded,        // remove
        onExpandStart   : _onExpandStart,   // remove
        onCollapseStart : _onCollapseStart, // remove
        onExpandEnd     : _onExpandEnd,     // remove
        onCollapseEnd   : _onCollapseEnd,   // remove
        
        
        
        // components:
        panelComponent  = (<Generic<TElement> /> as React.ReactComponentElement<any, GenericProps<TElement>>),
        
        
        
        // children:
        children,
    ...restGenericProps} = props;
    
    
    
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes` from `panelComponent`:
        panelComponent.props.classes,
        
        
        
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // classes:
        'tabPanel',
    );
    const stateClasses = useMergeClasses(
        // preserves the original `stateClasses` from `panelComponent`:
        panelComponent.props.stateClasses,
        
        
        
        // preserves the original `stateClasses` from `props`:
        props.stateClasses,
        
        
        
        // states:
        collapsibleState.class,
    );
    
    
    
    // handlers:
    const handleAnimationStart = useMergeEvents(
        // preserves the original `onAnimationStart` from `panelComponent`:
        panelComponent.props.onAnimationStart,
        
        
        
        // preserves the original `onAnimationStart` from `props`:
        props.onAnimationStart,
        
        
        
        // states:
        collapsibleState.handleAnimationStart,
    );
    const handleAnimationEnd   = useMergeEvents(
        // preserves the original `onAnimationEnd` from `panelComponent`:
        panelComponent.props.onAnimationEnd,
        
        
        
        // preserves the original `onAnimationEnd` from `props`:
        props.onAnimationEnd,
        
        
        
        // states:
        collapsibleState.handleAnimationEnd,
    );
    
    
    
    // jsx:
    return (
        <AccessibilityProvider
            // states:
            enabled={enabled}
            inheritEnabled={inheritEnabled}
        >
            {/* <Panel> */}
            {React.cloneElement<GenericProps<TElement>>(panelComponent,
                // props:
                {
                    // other props:
                    ...restGenericProps,
                    ...panelComponent.props, // overwrites restGenericProps (if any conflics)
                    
                    
                    
                    // semantics:
                    semanticTag       : panelComponent.props.semanticTag  ?? props.semanticTag  ?? '',         // no corresponding semantic tag => defaults to <div>
                    semanticRole      : panelComponent.props.semanticRole ?? props.semanticRole ?? 'tabpanel', // uses [role="tabpanel"] as the default semantic role
                    
                    
                    
                    // classes:
                    classes           : classes,
                    stateClasses      : stateClasses,
                    
                    
                    
                    // handlers:
                    onAnimationStart  : handleAnimationStart,
                    onAnimationEnd    : handleAnimationEnd,
                },
                
                
                
                // children:
                panelComponent.props.children ?? ((!lazy || isVisible || (tabPanelStyle === 'maxContent')) && children),
            )}
        </AccessibilityProvider>
    );
};
export {
    TabPanel,
    TabPanel as default,
}



export interface TabPanelComponentProps<TElement extends Element = HTMLElement, TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>
{
    // components:
    tabPanelComponent ?: React.ReactComponentElement<any, TabPanelProps<TElement, TTabExpandedChangeEvent>>
}
