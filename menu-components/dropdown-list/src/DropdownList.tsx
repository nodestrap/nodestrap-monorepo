// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// cssfn:
import type {
    // css known (standard) properties:
    CssKnownProps,
}                           from '@cssfn/css-types'             // cssfn css specific types
import {
    // styles:
    style,
    imports,
}                           from '@cssfn/cssfn'                 // writes css in javascript
import {
    // style sheets:
    createUseStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook
import {
    cssConfig,
    
    
    
    // utilities:
    usesCssProps,
}                           from '@cssfn/css-config'            // reads/writes css variables configuration

// reusable-ui:
import {
    // hooks:
    useEvent,
    useMergeEvents,
    useMergeRefs,
}                           from '@reusable-ui/hooks'           // react helper hooks
import type {
    // types:
    Role,
    
    
    
    // react components:
    GenericProps,
}                           from '@reusable-ui/generic'         // a generic component
import {
    // hooks:
    usesSizeVariant,
    OrientationName,
    OrientationVariantOptions,
    OrientationVariant,
    useOrientationVariant,
}                           from '@reusable-ui/basic'           // a base component
import {
    // hooks:
    useActivePassiveState,
    ActiveChangeEvent,
    ToggleActiveProps,
}                           from '@reusable-ui/indicator'       // a base component
export type {
    // types:
    PopupPlacement,
    PopupMiddleware,
    PopupStrategy,
    PopupPosition,
    PopupSide,
}                           from '@reusable-ui/collapse'        // a base component
import {
    // hooks:
    defaultOrientationRuleOptions,
    
    
    
    // styles:
    usesCollapseLayout,
    usesCollapseVariants,
    usesCollapseStates,
    
    
    
    // react components:
    CollapseProps,
    Collapse,
}                           from '@reusable-ui/collapse'        // a base component
import {
    // hooks:
    ListStyle,
    ListVariant,
    
    
    
    // react components:
    ListItemProps,
    ListItem,
    
    ListSeparatorItem,
    
    ListProps,
    List,
}                           from '@reusable-ui/list'            // represents a series of content



// utilities:
export const calculateSemanticRole = <TElement extends Element = HTMLElement>(props: ListProps<TElement>): Role|null => {
    if (props.role) return null; // pre defined role => no need to determine
    
    
    
    const children          = props.children;
    const defaultActionCtrl = props.actionCtrl ?? true;
    if (React.Children.toArray(children).some((child) => {
        if (!React.isValidElement<ListItemProps<Element>>(child)) {
            return !defaultActionCtrl;                             // if the default is not an actionCtrl => not a menu item => role='dialog'
        }
        else {
            return !(child.props.actionCtrl ?? defaultActionCtrl); // if <ListItem>  is not an actionCtrl => not a menu item => role='dialog'
        } // if
    })) return 'dialog'; // one/some <ListItem>s are [actionCtrl=false] => role='dialog'
    
    
    
    return 'menu'; // all <ListItem>s are [actionCtrl=true] => role='menu'
};



// react components:

export type DropdownListCloseType = 'shortcut'|'blur'
export interface DropdownListActiveChangeEvent extends ActiveChangeEvent {
    closeType : DropdownListCloseType
}
export interface DropdownListAction<TDropdownListActiveChangeEvent extends DropdownListActiveChangeEvent = DropdownListActiveChangeEvent>
    extends
        // accessibilities:
        Pick<ToggleActiveProps<TDropdownListActiveChangeEvent>, 'onActiveChange'>
{
}

export interface DropdownListComponentUIProps<TDropdownListActiveChangeEvent extends DropdownListActiveChangeEvent = DropdownListActiveChangeEvent>
    extends
        // accessibilities:
        DropdownListAction<TDropdownListActiveChangeEvent>
{
    // accessibilities:
    tabIndex ?: number
}
export interface DropdownListComponentProps<TDropdownListActiveChangeEvent extends DropdownListActiveChangeEvent = DropdownListActiveChangeEvent>
    extends
        // component ui:
        DropdownListComponentUIProps<TDropdownListActiveChangeEvent>
{
    // refs:
    dropdownListRef ?: React.Ref<Element> // setter ref
    
    
    
    // components:
    children     : React.ReactElement<(GenericProps<Element>|React.HTMLAttributes<HTMLElement>|React.SVGAttributes<SVGElement>) & DropdownListComponentUIProps<TDropdownListActiveChangeEvent>>
}

export interface DropdownListProps<TElement extends Element = HTMLElement, TDropdownListActiveChangeEvent extends DropdownListActiveChangeEvent = DropdownListActiveChangeEvent>
    extends
        // bases:
        Omit<CollapseProps<TElement>,
            // children:
            |'children' // we use `children` prop as a dropdownList component
        >,
        
        // components:
        DropdownListComponentProps<TDropdownListActiveChangeEvent>
{
}
const DropdownList = <TElement extends Element = HTMLElement, TDropdownListActiveChangeEvent extends DropdownListActiveChangeEvent = DropdownListActiveChangeEvent>(props: DropdownListProps<TElement, TDropdownListActiveChangeEvent>): JSX.Element|null => {
    // styles:
    const styleSheet         = useDropdownListStyleSheet();
    
    
    
    // variants:
    const orientationVariant = useOrientationVariant(props);
    const isOrientationBlock = ((orientationVariant.class || defaultOrientationRuleOptions.defaultOrientation) === 'block');
    
    
    
    // states:
    
    // accessibilities:
    const activePassiveState = useActivePassiveState<TElement>(props);
    const isVisible          = activePassiveState.isVisible; // visible = showing, shown, hidding ; !visible = hidden
    
    
    
    // rest props:
    const {
        // accessibilities:
        onActiveChange,
        
        
        
        // components:
        dropdownListRef,
        tabIndex,
        children: dropdownListComponent,
    ...restCollapseProps} = props;
    
    
    
    // verifies:
    React.Children.only(dropdownListComponent);
    if (!React.isValidElement<GenericProps<Element>|React.HTMLAttributes<HTMLElement>|React.SVGAttributes<SVGElement>>(dropdownListComponent)) throw Error('Invalid child element.');
    const isReusableUiComponent : boolean = (typeof(dropdownListComponent.type) !== 'string');
    
    
    
    // jsx:
    return (
        <Collapse<TElement>
            // other props:
            {...restCollapseProps}
            
            
            
            // variants:
            nude={props.nude ?? true}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
            
            
            
            // popups:
            popupPlacement={props.popupPlacement ?? (isOrientationBlock ? 'bottom' : 'right')}
            popupAutoFlip={props.popupAutoFlip ?? true}
            popupAutoShift={props.popupAutoShift ?? true}
            
            
            
            // handlers:
            onKeyDown={handleKeyDown}
            onAnimationEnd={handleAnimationEnd}
        >
            {React.cloneElement<GenericProps<Element> & React.RefAttributes<Element> & DropdownListComponentUIProps<TDropdownListActiveChangeEvent>>(dropdownListComponent,
                // props:
                {
                    // refs:
                    [isReusableUiComponent ? 'elmRef' : 'ref'] : mergedDropdownListRef,
                    
                    
                    
                    // accessibilities:
                    tabIndex : dropdownListComponent.props.tabIndex ?? tabIndex,
                    
                    
                    
                    // handlers:
                    ...(isReusableUiComponent ? {
                        onActiveChange : handleActiveChange,
                    } : null),
                }
            )}
        </Collapse>
    );
};
export {
    DropdownList,
    DropdownList as default,
}

export type { OrientationName, OrientationVariant }
