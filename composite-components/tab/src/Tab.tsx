// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useId,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // basic variants of UI:
    useBasicVariantProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    GenericProps,
    Generic,
}                           from '@reusable-ui/generic'         // a base component
import type {
    BasicProps,
}                           from '@reusable-ui/basic'           // a base component

// internals:
import {
    // states:
    TabExpandedChangeEvent,
    
    
    
    // react components:
    TabStateProps,
    TabStateProvider,
}                           from './states/tabState.js'
import {
    // react components:
    TabHeaderProps,
    TabHeader,
}                           from './TabHeader.js'
import {
    // react components:
    TabBodyProps,
    TabBody,
}                           from './TabBody.js'



// styles:
export const useTabStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles.js')
, { id: 'g7mp3ol8df' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:
export interface TabProps<TElement extends Element = HTMLElement, TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>
    extends
        // bases:
        Omit<GenericProps<TElement>,            // the *wrapper* component of <Generic<TElement> >
            // refs:
            |'elmRef'                           // the elmRef is moved to <TabHeader>
            
            // values:
            |'defaultValue'                     // not supported
            |'value'                            // not supported
            |'onChange'                         // not supported
            
            // formats:
            |'autoCapitalize'                   // not supported
            
            // children:
            |'children'                         // aliased `children` to `tabPanels`
            |'dangerouslySetInnerHTML'          // not supported
        >,
        Omit<TabHeaderProps<Element>,           // the *main* component of <List<Element> >
            // <Generic>:
            |keyof Omit<GenericProps<TElement>,
                // refs:
                |'elmRef'                       // the elmRef is moved to <TabHeader>
                
                // children:
                |'children'                     // aliased `children` to `tabPanels`
                |'dangerouslySetInnerHTML'      // not supported
            >
        >,
        Omit<TabBodyProps<Element>,             // the *complement* component of <Content<Element> >
            |keyof BasicProps<Element>
        >,
        
        // states:
        Omit<TabStateProps<TTabExpandedChangeEvent>,
            // data:
            |'tabPanels'                        // already aliased by `children`
            |'tabId'                            // already aliased by `id`
        >
{
    // children:
    children : TabStateProps<TTabExpandedChangeEvent>['tabPanels']
}
const Tab = <TElement extends Element = HTMLElement, TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>(props: TabProps<TElement, TTabExpandedChangeEvent>): JSX.Element|null => {
    // styles:
    const styles = useTabStyleSheet();
    
    
    
    // identifiers:
    const defaultId = useId();
    
    
    
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    
    
    
    // rest props:
    const {
        // refs:
        elmRef,
        outerRef,
        
        
        
        // identifiers:
        id = defaultId,
        
        
        
        // variants:
        size     : _size,               // remove
        theme    : _theme,              // remove
        gradient : _gradient,           // remove
        outlined : _outlined,           // remove
        mild     : _mild,               // remove
        
        orientation,
        listStyle,
        tabPanelStyle,
        
        
        
        // accessibilities:
        label,
        
        
        
        // behaviors:
        actionCtrl,
        
        
        
        // states:
        enabled,
        inheritEnabled,
        active,
        inheritActive,
        readOnly,
        inheritReadOnly,
        
        children : tabPanels,
        defaultExpandedTabIndex,
        expandedTabIndex,
        onExpandedChange,
        
        
        
        // components:
        listComponent,
        listItemComponent,
        bodyComponent,
    ...restGenericProps} = props;
    
    
    
    // jsx:
    return (
        /* the *wrapper* component of <Generic<TElement> > */
        <Generic<TElement>
            // other props:
            {...restGenericProps}
            
            
            
            // refs:
            outerRef={outerRef}
            
            
            
            // identifiers:
            id={id}
            
            
            
            // semantics:
            tag={props.tag ?? 'div'}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styles.main}
        >
            <TabStateProvider<TTabExpandedChangeEvent>
                // states:
                defaultExpandedTabIndex={defaultExpandedTabIndex}
                expandedTabIndex={expandedTabIndex}
                onExpandedChange={onExpandedChange}
                
                
                
                // data:
                tabPanels={tabPanels}
                tabId={id}
                tabPanelStyle={tabPanelStyle}
            >
                {/* the *main* component of <List<Element> > */}
                <TabHeader<Element>
                    // refs:
                    elmRef={elmRef}
                    
                    
                    
                    // variants:
                    {...basicVariantProps}
                    
                    orientation={orientation}
                    listStyle={listStyle}
                    
                    
                    
                    // accessibilities:
                    label={label}
                    
                    
                    
                    // behaviors:
                    actionCtrl={actionCtrl}
                    
                    
                    
                    // states:
                    enabled={enabled}
                    inheritEnabled={inheritEnabled}
                    active={active}
                    inheritActive={inheritActive}
                    readOnly={readOnly}
                    inheritReadOnly={inheritReadOnly}
                    
                    
                    
                    // components:
                    listComponent={listComponent}
                    listItemComponent={listItemComponent}
                />
                
                {/* the *complement* component of <Content<Element> > */}
                <TabBody<Element>
                    // variants:
                    {...basicVariantProps}
                    
                    
                    
                    // components:
                    bodyComponent={bodyComponent}
                />
            </TabStateProvider>
        </Generic>
    );
};
export {
    Tab,
    Tab as default,
}
