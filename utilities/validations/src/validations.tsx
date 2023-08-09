// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
    
    
    
    // contexts:
    createContext,
    useContext,
}                           from 'react'



// defaults:
const _defaultEnableRootValidation = false // no validation at root level
const _defaultEnableValidation     = true  // perform validation at <ValidationProvider>

const _defaultIsValid              = undefined as (Result|undefined) // all descendants are independent valid/invalid/uncheck

const _defaultInheritValidation    = true  // if ancestor is valid/invalid/uncheck => all descendants are forced to valid/invalid/uncheck



// validation results:

/**
 * No validation was performed. Neither success nor error is shown.
 */
export type Uncheck = null
/**
 * Validation was failed because the value did not meet the criteria.
 */
export type Error   = false
/**
 * Validation was successful and the value meets the criteria.
 */
export type Success = true
export type Result  = Uncheck|Error|Success;



// contexts:

/**
 * Contains validation props.
 */
export interface Validation {
    /**
     * `true`      : validation is enabled  - implements `isValid` prop.  
     * `false`     : validation is disabled - equivalent as `isValid = null` (uncheck).
     */
    enableValidation  : boolean
    
    /**
     * `undefined` : *automatic* detect valid/invalid state.  
     * `null`      : force validation state to *uncheck*.  
     * `true`      : force validation state to *valid*.  
     * `false`     : force validation state to *invalid*.
     */
    isValid?          : Result
}

interface ValidationRoot {
    atRoot?           : true|undefined
}

/**
 * A react context for validation stuff.
 */
export const ValidationContext = createContext<Validation & ValidationRoot>(/*defaultValue :*/{
    enableValidation  : _defaultEnableValidation,
    isValid           : _defaultIsValid,
    
    atRoot            : true,
});
ValidationContext.displayName  = 'Validation';



// hooks:
export const usePropValidation = (props: ValidationProps): Validation & ValidationRoot => {
    // contexts:
    const valContext = useContext(ValidationContext);
    const atRoot     = valContext.atRoot;
    
    
    
    const inheritValidation : boolean = props.inheritValidation ?? _defaultInheritValidation;
    
    
    
    const enableValidation = atRoot ? (props.enableValidation ?? _defaultEnableRootValidation) : (
        (
            inheritValidation
            ?
            valContext.enableValidation // inherit
            :
            true                        // independent
        )
        &&
        (props.enableValidation ?? _defaultEnableValidation)
    );
    const isValid = ((): Result|undefined => {
        if (!enableValidation) return null; // if validation was disabled => treat validity as `uncheck` (null)
        
        
        
        const contextIsValid = (
            inheritValidation
            ?
            valContext.isValid          // force inherit to descendants (if was set)
            :
            undefined                   // independent descendants
        );
        if (contextIsValid !== undefined) return contextIsValid; // if the context's validity was set other than `auto` (undefined) => force inherit to descendants
        
        
        
        return props.isValid;                                    // otherwise => use the component's validity
    })();
    return useMemo<Validation & ValidationRoot>(() => ({
        // validations:
        enableValidation, // mutable value
        isValid,          // mutable value
        atRoot,           // mutable value
    }), [
        // validations:
        enableValidation,
        isValid,
        atRoot,
    ]);
};

export const usePropIsValid    = (props: ValidationProps): Result|undefined => {
    return usePropValidation(props).isValid;
};



// react components:

export interface ValidationProps extends React.PropsWithChildren<Partial<Validation>>
{
    /**
     * `undefined` : same as `true`.  
     * `true`      : validation is enabled  - implements `isValid` prop.  
     * `false`     : validation is disabled - equivalent as `isValid = null` (uncheck).
     */
    enableValidation  ?: boolean
    
    /**
     * `undefined` : *automatic* detect valid/invalid state.  
     * `null`      : force validation state to *uncheck*.  
     * `true`      : force validation state to *valid*.  
     * `false`     : force validation state to *invalid*.
     */
    isValid           ?: Result
    
    /**
     * `undefined` : same as `true`.  
     * `true`      : inherits `enableValidation` & `isValid` from parent (`ValidationProvider` context).  
     * `false`     : independent `enableValidation` & `isValid`.
     */
    inheritValidation ?: boolean
}
const ValidationProvider = (props: ValidationProps): JSX.Element|null => {
    // fn props:
    const propValidationWithRoot = usePropValidation(props);
    const {
        enableValidation,
        isValid,
    } = props;
    
    const propValidation = useMemo<Validation>(() => {
        if (propValidationWithRoot.atRoot) {
            // at root:
            
            const {
                atRoot : _atRoot, // remove
            ...propValidation} = propValidationWithRoot;
            
            propValidation.enableValidation = enableValidation ?? _defaultEnableValidation;
            propValidation.isValid          = isValid          ?? _defaultIsValid;
            
            return propValidation;
        }
        else {
            // at nested:
            
            return propValidationWithRoot; // a stable object as long as its properties remain the same
        } // if
    }, [
        propValidationWithRoot, // a stable object as long as its properties remain the same
        
        enableValidation,
        isValid,
    ]);
    
    
    
    return (
        <ValidationContext.Provider value={propValidation}>
            {props.children}
        </ValidationContext.Provider>
    );
};
export {
    ValidationProvider,
    ValidationProvider as default,
}
