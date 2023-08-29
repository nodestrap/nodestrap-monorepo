// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useId,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    useMergeEvents,
    useMergeRefs,
    useMergeClasses,
    useScheduleTriggerEvent,
    
    
    
    // an accessibility management system:
    usePropEnabled,
    usePropReadOnly,
    
    
    
    // a capability of UI to rotate its layout:
    OrientationName,
    OrientationableWithDirectionProps,
    useOrientationableWithDirection,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    UncontrollableCollapsibleProps,
    useUncontrollableCollapsible,
    
    
    
    // a capability of UI to be highlighted/selected/activated:
    ActiveChangeEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import type {
    // semantics:
    ButtonType,
    
    
    
    // variants:
    ButtonStyle,
    ButtonVariant,
    
    
    
    // react components:
    ButtonProps,
    
    ButtonComponentProps,
}                           from '@reusable-ui/button'          // a button component for initiating an action
import {
    ToggleButtonProps,
    ToggleButton,
    
    ToggleButtonComponentProps,
}                           from '@reusable-ui/toggle-button'   // a button with toggleable active state
import {
    // react components:
    ButtonIcon,
}                           from '@reusable-ui/button-icon'     // a button component with a nice icon
import {
    // react components:
    DropdownUiComponentProps,
    
    DropdownActionType,
    DropdownExpandedChangeEvent,
    
    DropdownProps,
    Dropdown,
    
    DropdownComponentProps,
}                           from '@reusable-ui/dropdown'        // overlays contextual element such as lists, menus, and more

// internals:
import {
    // defaults:
    defaultOrientationableWithDirectionOptions,
}                           from './defaults.js'



// react components:
export interface DropdownButtonProps<TDropdownExpandedChangeEvent extends DropdownExpandedChangeEvent = DropdownExpandedChangeEvent>
    extends
        // bases:
        Omit<ButtonProps,
            // children:
            |'children' // we redefined `children` prop as a <DropdownUi> component
            
            // variants:
            |'orientation' // we upgraded `orientation` with `OrientationWithDirectionName`
        >,
        
        // additional bases:
        Omit<DropdownProps<Element, TDropdownExpandedChangeEvent>,
            // refs:
            |'elmRef'|'outerRef' // all (elm|outer)Ref are for <Button>
            
            // DOMs:
            |Exclude<keyof React.DOMAttributes<Element>, 'children'> // all DOM [attributes] are for <Button>
            
            // variants:
            |'orientation' // we upgraded `orientation` with `OrientationWithDirectionName`
        >,
        
        // variants:
        OrientationableWithDirectionProps,
        
        // states:
        UncontrollableCollapsibleProps<TDropdownExpandedChangeEvent>,
        
        // components:
        Omit<ButtonComponentProps,
            |'buttonStyle' // the <DropdownButton> already have buttonStyle prop
        >,
        ToggleButtonComponentProps,
        DropdownUiComponentProps<Element>,
        DropdownComponentProps<Element, TDropdownExpandedChangeEvent>
{
}
const DropdownButton = <TDropdownExpandedChangeEvent extends DropdownExpandedChangeEvent = DropdownExpandedChangeEvent>(props: DropdownButtonProps<TDropdownExpandedChangeEvent>): JSX.Element|null => {
    // variants:
    const dropdownOrientationableVariant = useOrientationableWithDirection(props, defaultOrientationableWithDirectionOptions);
    const determineDropdownIcon = () => {
        // TODO: RTL direction aware
        switch(dropdownOrientationableVariant.orientation) {
            case 'inline-start': return 'dropleft';
            case 'inline-end'  : return 'dropright';
            case 'block-start' : return 'dropup';
            default            : return 'dropdown';
        } // switch
    };
    const determineDropdownIconPosition = (buttonOrientation: OrientationName) => {
        switch(dropdownOrientationableVariant.orientation) {
            case 'inline-start':
                if (buttonOrientation === 'inline') return 'start';
                break;
            case 'inline-end'  :
                if (buttonOrientation === 'inline') return 'end';
                break;
            case 'block-start' :
                if (buttonOrientation === 'block') return 'start';
                break;
            default            :
                if (buttonOrientation === 'block') return 'end';
                break;
        } // switch
        
        return 'end';
    };
    const determineDropdownOrientation = () => {
        switch(dropdownOrientationableVariant.orientation) {
            case 'inline-start': return 'inline';
            case 'inline-end'  : return 'inline';
            case 'block-start' : return 'block';
            default            : return 'block';
        } // switch
    };
    const determineFloatingPlacement = () => {
        // TODO: RTL direction aware
        switch(dropdownOrientationableVariant.orientation) {
            case 'inline-start': return 'left';
            case 'inline-end'  : return 'right';
            case 'block-start' : return 'top';
            default            : return 'bottom';
        } // switch
    };
    
    
    
    // rest props:
    const {
        // behaviors:
        lazy,
        
        
        
        // states:
        defaultExpanded,  // take, to be handled by `useUncontrollableCollapsible`
        expanded,         // take, to be handled by `useUncontrollableCollapsible`
        onExpandedChange, // take, to be handled by `useUncontrollableCollapsible`
        
        onExpandStart,    // take, to be handled by <Dropdown>
        onCollapseStart,  // take, to be handled by <Dropdown>
        onExpandEnd,      // take, to be handled by <Dropdown>
        onCollapseEnd,    // take, to be handled by <Dropdown>
        
        
        
        // floatable:
        floatingRef,
        
        floatingOn,
        floatingPlacement     = determineFloatingPlacement(),
        floatingMiddleware,
        floatingStrategy,
        
        floatingAutoFlip,
        floatingAutoShift,
        floatingOffset,
        floatingShift,
        
        onFloatingUpdate,
        
        
        
        // global stackable:
        viewport,
        
        
        
        // auto focusable:
        autoFocusOn,
        restoreFocusOn,
        autoFocus,
        restoreFocus,
        autoFocusScroll,
        restoreFocusScroll,
        
        
        
        // components:
        buttonRef,
        buttonOrientation     = 'inline',
        buttonComponent       = (<ButtonIcon iconPosition={determineDropdownIconPosition(buttonOrientation)} icon={determineDropdownIcon()} />   as React.ReactComponentElement<any, ButtonProps>),
        buttonChildren,
        
        toggleButtonComponent = (<ToggleButton /> as React.ReactComponentElement<any, ToggleButtonProps>),
        
        // tabIndex, // the [tabIndex] is still attached to <Button>
        children: dropdownUiComponent,
        
        dropdownRef,
        dropdownOrientation   = determineDropdownOrientation(),
        dropdownComponent     = (<Dropdown<Element, TDropdownExpandedChangeEvent> >{dropdownUiComponent}</Dropdown> as React.ReactComponentElement<any, DropdownProps<Element, TDropdownExpandedChangeEvent>>),
    ...restButtonProps} = props;
    
    
    
    // identifiers:
    const defaultId  = useId();
    const dropdownId = dropdownComponent.props.id ?? defaultId;
    
    
    
    // states:
    const [isExpanded, setExpanded] = useUncontrollableCollapsible<TDropdownExpandedChangeEvent>({
        enabled         : props.enabled,
        inheritEnabled  : props.inheritEnabled,
        readOnly        : props.readOnly,
        inheritReadOnly : props.inheritReadOnly,
        
        defaultExpanded,
        expanded,
        // onExpandedChange, // trigger manually `onExpandedChange`, not to passed here to avoid double trigger of `onExpandedChange`
    });
    
    
    
    // refs:
    const buttonRefInternal = useRef<HTMLButtonElement|null>(null);
    const mergedButtonRef   = useMergeRefs(
        // preserves the original `elmRef` from `buttonComponent`:
        buttonComponent.props.elmRef,
        
        
        
        // preserves the original `buttonRef` from `props`:
        buttonRef,
        // preserves the original `elmRef` from `props`:
        props.elmRef,
        
        
        
        buttonRefInternal,
    );
    const mergedDropdownRef = useMergeRefs(
        // preserves the original `outerRef` from `dropdownComponent`:
        dropdownComponent.props.outerRef,
        
        
        
        // preserves the original `dropdownRef` from `props`:
        dropdownRef,
    );
    
    
    
    // classes:
    const toggleButtonClasses = useMergeClasses(
        // preserves the original `classes` from `toggleButtonComponent`:
        toggleButtonComponent.props.classes,
        
        
        
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // hacks:
        'last-visible-child', // a fix for <DropdownButton> inside a <Group>
    );
    
    
    
    // accessibilities:
    const propEnabled          = usePropEnabled(props);
    const propReadOnly         = usePropReadOnly(props);
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // events:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    const triggerExpandedChangeByToggleButton = useEvent<React.Dispatch<boolean>>((expanded) => {
        // create an expanded event:
        const dropdownExpandedChangeEvent = { expanded, actionType: 'ui' } as TDropdownExpandedChangeEvent;
        
        
        
        if (onExpandedChange) scheduleTriggerEvent(() => { // runs the `onExpandedChange` event *next after* current macroTask completed
            // fire `onExpandedChange` react event:
            // <ToggleButton> expanded/collapsed => request to show/hide the <Dropdown> with `actionType`:
            onExpandedChange(dropdownExpandedChangeEvent); // request to change the [expanded] to <Parent>
        });
        
        
        
        // actions:
        handleExpandedChangeInternal(dropdownExpandedChangeEvent); // update for uncontrollable <DropdownButton>
    });
    
    
    
    // handlers:
    const handleExpandedChangeInternal       = useEvent<EventHandler<TDropdownExpandedChangeEvent>>((event) => {
        setExpanded(event.expanded);
    });
    
    const handleExpandedChangeByToggleButton = useEvent<EventHandler<ActiveChangeEvent>>((event) => {
        // conditions:
        if (isDisabledOrReadOnly) return; // control is disabled or readOnly => no response required
        
        const newExpanded = event.active;
        if (newExpanded === isExpanded) return; // still the same => nothing to update
        
        
        
        triggerExpandedChangeByToggleButton(newExpanded);
    });
    const handleToggleButtonActiveChange     = useMergeEvents(
        // preserves the original `onActiveChange` from `toggleButtonComponent`:
        toggleButtonComponent.props.onActiveChange,
        
        
        
        // forwards the original `onExpandedChange` from `props`:
        handleExpandedChangeByToggleButton,
    );
    
    const handleDropdownExpandedChange       = useMergeEvents(
        // preserves the original `onExpandedChange` from `dropdownComponent`:
        dropdownComponent.props.onExpandedChange,
        
        
        
        // preserves the original `onExpandedChange` from `props`:
        onExpandedChange,
        
        
        
        // actions:
        handleExpandedChangeInternal, // update for uncontrollable <DropdownButton>
    );
    
    const handleDropdownFloatingUpdate       = useMergeEvents(
        // preserves the original `onFloatingUpdate` from `dropdownComponent`:
        dropdownComponent.props.onFloatingUpdate,
        
        
        
        // preserves the original `onFloatingUpdate` from `props`:
        onFloatingUpdate,
    );
    
    const handleExpandStart                  = useMergeEvents(
        // preserves the original `onExpandStart` from `dropdownComponent`:
        dropdownComponent.props.onExpandStart,
        
        
        
        // preserves the original `onExpandStart` from `props`:
        onExpandStart,
    );
    const handleCollapseStart                = useMergeEvents(
        // preserves the original `onCollapseStart` from `dropdownComponent`:
        dropdownComponent.props.onCollapseStart,
        
        
        
        // preserves the original `onCollapseStart` from `props`:
        onCollapseStart,
    );
    const handleExpandEnd                    = useMergeEvents(
        // preserves the original `onExpandEnd` from `dropdownComponent`:
        dropdownComponent.props.onExpandEnd,
        
        
        
        // preserves the original `onExpandEnd` from `props`:
        onExpandEnd,
    );
    const handleCollapseEnd                  = useMergeEvents(
        // preserves the original `onCollapseEnd` from `dropdownComponent`:
        dropdownComponent.props.onCollapseEnd,
        
        
        
        // preserves the original `onCollapseEnd` from `props`:
        onCollapseEnd,
    );
    
    
    
    // jsx:
    return (
        <>
            {/* <ToggleButton> */}
            {React.cloneElement<ToggleButtonProps>(toggleButtonComponent,
                // props:
                {
                    // semantics:
                    'aria-controls' : toggleButtonComponent.props['aria-controls'] ?? dropdownId,
                    
                    
                    
                    // classes:
                    classes         : toggleButtonClasses,
                    
                    
                    
                    // states:
                    active          : toggleButtonComponent.props.active ?? isExpanded,
                    onActiveChange  : handleToggleButtonActiveChange,
                    
                    
                    
                    /* <Button> */
                    buttonComponent : toggleButtonComponent.props.buttonComponent ?? React.cloneElement<ButtonProps>(buttonComponent,
                        // props:
                        {
                            // other props:
                            ...restButtonProps,
                            ...buttonComponent.props, // overwrites restButtonProps (if any conflics)
                            
                            
                            
                            // refs:
                            elmRef      : mergedButtonRef,
                            
                            
                            
                            // variants:
                            orientation : buttonComponent.props.orientation ?? buttonOrientation,
                        },
                    ),
                },
                
                
                
                // children:
                buttonComponent.props.children ?? toggleButtonComponent.props.children ?? buttonChildren,
            )}
            
            {/* <Dropdown> */}
            {React.cloneElement<DropdownProps<Element, TDropdownExpandedChangeEvent>>(dropdownComponent,
                // props:
                {
                    // refs:
                    outerRef           : mergedDropdownRef,
                    
                    
                    
                    // identifiers:
                    id                 : dropdownId,
                    
                    
                    
                    // variants:
                    orientation        : dropdownComponent.props.orientation        ?? dropdownOrientation,
                    
                    
                    
                    // behaviors:
                    lazy               : dropdownComponent.props.lazy               ?? lazy,
                    
                    
                    
                    // states:
                    expanded           : dropdownComponent.props.expanded           ?? isExpanded,
                    onExpandedChange   : handleDropdownExpandedChange,
                    
                    onExpandStart      : handleExpandStart,
                    onCollapseStart    : handleCollapseStart,
                    onExpandEnd        : handleExpandEnd,
                    onCollapseEnd      : handleCollapseEnd,
                    
                    
                    
                    // floatable:
                    floatingRef        : dropdownComponent.props.floatingRef        ?? floatingRef,
                    
                    floatingOn         : dropdownComponent.props.floatingOn         ?? floatingOn         ?? buttonRefInternal,
                    floatingPlacement  : dropdownComponent.props.floatingPlacement  ?? floatingPlacement,
                    floatingMiddleware : dropdownComponent.props.floatingMiddleware ?? floatingMiddleware,
                    floatingStrategy   : dropdownComponent.props.floatingStrategy   ?? floatingStrategy,
                    
                    floatingAutoFlip   : dropdownComponent.props.floatingAutoFlip   ?? floatingAutoFlip,
                    floatingAutoShift  : dropdownComponent.props.floatingAutoShift  ?? floatingAutoShift,
                    floatingOffset     : dropdownComponent.props.floatingOffset     ?? floatingOffset,
                    floatingShift      : dropdownComponent.props.floatingShift      ?? floatingShift,
                    
                    onFloatingUpdate   : handleDropdownFloatingUpdate,
                    
                    
                    
                    // global stackable:
                    viewport           : dropdownComponent.props.viewport           ?? viewport,
                    
                    
                    
                    // auto focusable:
                    autoFocusOn        : dropdownComponent.props.autoFocusOn        ?? autoFocusOn,
                    restoreFocusOn     : dropdownComponent.props.restoreFocusOn     ?? restoreFocusOn,
                    autoFocus          : dropdownComponent.props.autoFocus          ?? autoFocus,
                    restoreFocus       : dropdownComponent.props.restoreFocus       ?? restoreFocus,
                    autoFocusScroll    : dropdownComponent.props.autoFocusScroll    ?? autoFocusScroll,
                    restoreFocusScroll : dropdownComponent.props.restoreFocusScroll ?? restoreFocusScroll,
                },
                
                
                
                // children:
                dropdownComponent.props.children ?? dropdownUiComponent,
            )}
        </>
    );
};
export {
    DropdownButton,
    DropdownButton as default,
}

export type { DropdownActionType, DropdownExpandedChangeEvent }

export type { ButtonType, ButtonStyle, ButtonVariant }
