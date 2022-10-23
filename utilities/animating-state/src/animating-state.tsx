// react:
import {
    // types:
    SetStateAction,
    Reducer,
    Dispatch,
    AnimationEventHandler,
    
    
    
    // hooks:
    useReducer,
    useRef,
    useEffect,
}                           from 'react'

// reusable-ui utilities:
import {
    // hooks:
    useEvent,
}                           from '@reusable-ui/hooks'           // react helper hooks



interface AnimatingState<TState extends ({}|null)> {
    /**
     * The current state.
     */
    state     : TState
    
    /**
     * The animation of transition state -or- `undefined` if the transition was done.
     */
    animation : TState|undefined
}

const enum AnimatingStateActionType {
    /**
     * Changes the current state to a new state.
     */
    Change,
    
    /**
     * Marks the current transition state is done.
     */
    Done,
}

interface AnimatingStateChangeAction<TState extends ({}|null)> {
    type      : AnimatingStateActionType.Change,
    newState  : SetStateAction<TState>
}
interface AnimatingStateDoneAction {
    type      : AnimatingStateActionType.Done,
}
type AnimatingStateAction<TState extends ({}|null)> =
    |AnimatingStateChangeAction<TState>
    |AnimatingStateDoneAction

const animatingStateReducer = <TState extends ({}|null)>(oldState: AnimatingState<TState>, action: AnimatingStateAction<TState>): AnimatingState<TState> => {
    switch (action.type) {
        case AnimatingStateActionType.Change:
            {
                const newState = (typeof(action.newState) !== 'function') ? action.newState : (action.newState as ((prevState: TState) => TState))(oldState.state);
                if (!Object.is(oldState.state, newState)) {    // the newState is **different** than oldState
                    return {
                        state     : newState,                  // remember the new state
                        animation : (
                            (oldState.animation === undefined) // if not **being** animated
                            ?
                            newState                           // start animation of **new** state
                            :
                            oldState.animation                 // continue unfinished animation of **old** state
                        ),
                    };
                } // if
            }
            break;
        
        case AnimatingStateActionType.Done:
            if (oldState.animation !== undefined) { // **has** a running animation
                return {
                    state     : oldState.state,
                    animation : (
                        Object.is(oldState.animation, oldState.state)
                        
                        ?              // the current state **was animated**
                        undefined      // => stop animation of **current** state
                        
                        :              // the current state **was changed** during the animation
                        oldState.state // => start animation of **another** state
                    ),
                };
            } // if
            break;
    } // switch
    
    
    
    // no change:
    return oldState;
};



export interface AnimatingStateOptions<TState extends ({}|null)> {
    initialState       : TState        // required
    
    animationBubbling ?: boolean       // optional
    animationName      : string|RegExp // required
};
export const useAnimatingState = <TState extends ({}|null), TElement extends Element = HTMLElement>(options: AnimatingStateOptions<TState>) => {
    // options:
    const {
        initialState,
        
        animationBubbling = false,
        animationName,
    } = options;
    
    
    
    // states:
    const [state, dispatchState] = useReducer<Reducer<AnimatingState<TState>, AnimatingStateAction<TState>>>(animatingStateReducer, {
        // initials:
        state     : initialState,
        animation : undefined,
    });
    const expectedAnimation = useRef<TState|undefined>(undefined);
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        if (state.animation === undefined) return; // no animation => no expected animation to be verified
        
        
        
        // setups:
        let asyncCheckRunningAnimation = requestAnimationFrame(() => {
            // tests:
            if (Object.is(expectedAnimation.current, state.animation)) return; // the expected animation is running => verified
            
            
            
            // retry 1:
            asyncCheckRunningAnimation = requestAnimationFrame(() => {
                // tests:
                if (Object.is(expectedAnimation.current, state.animation)) return; // the expected animation is running => verified
                
                
                
                // retry 2:
                asyncCheckRunningAnimation = requestAnimationFrame(() => {
                    // tests:
                    if (Object.is(expectedAnimation.current, state.animation)) return; // the expected animation is running => verified
                    
                    
                    
                    // the expected animation is not running within 2 frames => NOT verified => mark as finished_animation:
                    dispatchState({ type: AnimatingStateActionType.Done });
                });
            });
        });
        
        
        
        // cleanups:
        return () => {
            cancelAnimationFrame(asyncCheckRunningAnimation);
        };
    }, [state.animation]);
    
    
    
    // handlers:
    const setState              = useEvent<Dispatch<SetStateAction<TState>>>((newState) => {
        // update with a new state:
        dispatchState({ type: AnimatingStateActionType.Change, newState });
    });
    const handleAnimationStart  = useEvent<AnimationEventHandler<TElement>>((event) => {
        // conditions:
        if (!animationBubbling && (event.target !== event.currentTarget)) return; // if not bubbling => ignores bubbling
        if (!event.animationName.match(animationName))                    return; // ignores foreign animations
        
        
        
        // mark the expected_css_animation has started:
        expectedAnimation.current = state.animation;
    });
    const handleAnimationEnd    = useEvent<AnimationEventHandler<TElement>>((event) => {
        // conditions:
        if (!animationBubbling && (event.target !== event.currentTarget)) return; // if not bubbling => ignores bubbling
        if (!event.animationName.match(animationName))                    return; // ignores foreign animations
        
        
        
        // mark the expected_css_animation has stopped:
        expectedAnimation.current = undefined;
        
        // clean up finished_animation:
        dispatchState({ type: AnimatingStateActionType.Done });
    });
    const handleAnimationCancel = handleAnimationEnd;
    
    
    // interfaces:
    return [
        state.state,               // getter    state
        setState,                  // setter    state
        state.animation,           // animation state
        {
            handleAnimationStart,  // animation-start  handler
            handleAnimationEnd,    // animation-end    handler
            handleAnimationCancel, // animation-cancel handler
        },
    ] as const;
};
