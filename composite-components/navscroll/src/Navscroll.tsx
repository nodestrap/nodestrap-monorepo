// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useReducer,
    useEffect,
    useMemo,
}                           from 'react'

// cssfn:
import type {
    // cssfn css specific types:
    CssSelector,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a set of React node utility functions:
    flattenChildren,
    
    
    
    // react helper hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import type {
    // variants:
    ListStyle,
    ListVariant,
    
    
    
    // react components:
    ListItemProps,
}                           from '@reusable-ui/list'            // represents a series of content
import {
    // react components:
    NavProps,
    Nav,
    
    NavComponentProps,
}                           from '@reusable-ui/nav'             // a navigation component to navigate between pages

// internals:
import {
    // utilities:
    Viewport,
    Dimension,
    findFirst,
    findLast,
    activeIndicesReducer,
}                           from './utilities.js'
import {
    // react components:
    ListItemWithNavigation,
}                           from './ListItemWithNavigation.js'



// react components:
export interface NavscrollProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        NavProps<TElement>,
        
        // components:
        NavComponentProps<TElement>,      // for factory
        NavscrollComponentProps<TElement> // for detecting nested <Navscroll>
{
    // scrolls:
    scrollingOf            ?: React.RefObject<HTMLElement>|HTMLElement|null // getter ref
    scrollingSelector      ?: CssSelector
    scrollingFilter        ?: (element: HTMLElement) => boolean
    scrollingInterpolation ?: boolean
}
const Navscroll = <TElement extends Element = HTMLElement>(props: NavscrollProps<TElement>): JSX.Element|null => {
    // states:
    const [activeIndices, setActiveIndices] = useReducer(activeIndicesReducer, []);
    
    
    
    // rest props:
    const {
        // variants:
        orientation = 'block',
        
        
        
        // scrolls:
        scrollingOf,
        scrollingSelector      = '*',
        scrollingFilter,
        scrollingInterpolation = true,
        
        
        
        // components:
        navComponent       = (<Nav<TElement> />       as React.ReactComponentElement<any, NavProps<TElement>>),
        navscrollComponent = (<Navscroll<TElement> /> as React.ReactComponentElement<any, NavscrollProps<TElement>>),
        
        
        
        // children:
        children,
    ...restNavProps} = props;
    const defaultNavProps : NavProps<TElement> = {
        // variants:
        orientation,
    };
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        const scrollingElm = (scrollingOf instanceof HTMLElement) ? scrollingOf : scrollingOf?.current;
        if (!scrollingElm) return; // scrollingElm was not set => nothing to do
        
        
        
        // functions:
        const updateSections = () => {
            const findUncroppedSection    = (viewport: Viewport, children: Dimension[]): readonly [Dimension, number]|null => {
                for (const [child, index] of children.map((child, index) => [child, index] as const)) {
                    // find current:
                    if (child.isFullyVisible(viewport)) return [child, index]; // found
                    
                    
                    
                    // find nested:
                    const childCropped = child.isPartiallyVisible(viewport);
                    if (childCropped) {
                        const childViewport = childCropped.toViewport();
                        const grandChildren = childViewport.children(scrollingSelector, scrollingFilter);
                        if (grandChildren.length && findUncroppedSection(childViewport, grandChildren)) {
                            return [childCropped, index]; // found in nested => return the parent instead of the grandChild
                        } // if
                    } // if
                } // foreach child
                
                
                
                return null; // not found
            };
            const findVisibleChildIndices = (viewport: Viewport, accumResults: number[] = []): number[] => {
                const children = viewport.children(scrollingSelector, scrollingFilter);
                const visibleChild = ((): readonly [Dimension, number]|null => {
                    if (scrollingInterpolation) {
                        return (
                            // at the end of scroll, the last section always win:
                            ((viewport.isLastScroll || null) && findLast(children, (child) => child.isPartiallyVisible(viewport)))
                            
                            ??
                            
                            // the first uncropped section always win:
                            findUncroppedSection(viewport, children)
                            
                            ??
                            
                            // the biggest cropped section always win:
                            children
                            .map((child, index) => {
                                const partialVisible = child.isPartiallyVisible(viewport);
                                
                                return {
                                    partialVisible,
                                    
                                    visibleArea    : (
                                        partialVisible
                                        ?
                                        (partialVisible.offsetWidth * partialVisible.offsetHeight) // calculates the visible area
                                        :
                                        0
                                    ),
                                    
                                    index          : index, // add index, so we can track the original index after sorted
                                };
                            })
                            .filter((item) => item.partialVisible) // only visible children
                            .sort((a, b) => b.visibleArea - a.visibleArea) // sort from biggest to smallest
                            .map((item): readonly [Dimension, number] => [item.partialVisible!, item.index])
                            [0] // find the biggest one
                            
                            ??
                            
                            // no winner:
                            null
                        );
                    }
                    else {
                        return (
                            // at the end of scroll, the last section always win:
                            ((viewport.isLastScroll || null) && findLast(children, (child) => child.isPartiallyVisible(viewport)))
                            
                            ??
                            
                            // the first visible (cropped/uncropped) section always win:
                            findFirst(children, (child) => child.isPartiallyVisible(viewport))
                        );
                    } // if
                })();
                
                
                
                if (!visibleChild) return accumResults;
                return findVisibleChildIndices(visibleChild[0].toViewport(), [...accumResults, visibleChild[1]]);
            };
            
            
            
            const visibleChildIndices = findVisibleChildIndices(Viewport.from(/*element: */scrollingElm));
            setActiveIndices(visibleChildIndices);
        };
        
        let isScheduledUpdateSections = false;
        let isMounted = true; // mark as mounted
        const scheduleUpdateSections = () => {
            // conditions:
            if (isScheduledUpdateSections) return; // already scheduled => ignore
            
            
            
            isScheduledUpdateSections = true; // mark as being scheduled
            requestAnimationFrame(() => {
                if (!isScheduledUpdateSections) return; // already done => ignore
                
                
                
                isScheduledUpdateSections = false; // mark as already done
                if (isMounted) updateSections(); // update the sections if the <Navscroll> is still alive
            });
        };
        
        
        
        // handlers:
        const handleScroll      = scheduleUpdateSections;
        const handleResized     = scheduleUpdateSections;
        const handleRemoved     = scheduleUpdateSections;
        const handleTextChanged = scheduleUpdateSections;
        
        
        
        // setups:
        scrollingElm.addEventListener('scroll', handleScroll, { capture: true }); // force `scroll` as bubbling
        
        
        
        const descendantsResizeObserver = new ResizeObserver(() => {
            // conditions:
            if (!isMounted) return;
            
            
            
            handleResized();
        });
        
        
        
        const descendantsMutationObserver = new MutationObserver((entries) => {
            // conditions:
            if (!isMounted) return;
            
            
            
            for (const entry of entries) {
                for (const addedItem of entry.addedNodes) {
                    handleItemAdded(addedItem);
                } // for
                
                
                
                for (const removedItem of entry.removedNodes) {
                    handleItemRemoved(removedItem);
                } // for
                
                
                
                if (entry.type === 'characterData') { // "text" node changed
                    handleTextChanged();
                } // for
            } // for
        });
        const handleItemAdded = (item: Node) => {
            if (item instanceof Element) { // <foo> element
                // refresh periodically:
                descendantsResizeObserver.observe(item, { box: 'border-box' }); // watch the offset size changes
            }
            else { // "text" node
                handleTextChanged();
            } // if
        };
        const handleItemRemoved = (item: Node) => {
            if (item instanceof Element) { // <foo> element
                // stop refresh periodically:
                descendantsResizeObserver.unobserve(item);
                
                handleRemoved();
            }
            else { // "text" node
                handleTextChanged();
            } // if
        };
        descendantsMutationObserver.observe(scrollingElm, {
            childList     : true,  // watch  for child's DOM structure changes
            subtree       : true,  // watch  for grandchild's DOM structure changes
            characterData : true,  // watch  for "text" node changes
            
            attributes    : false, // ignore for any attribute changes
        });
        
        
        
        // refresh first time:
        for (const descendant of (Array.from(scrollingElm.querySelectorAll('*')) as HTMLElement[])) {
            handleItemAdded(descendant)
        } // for
        
        
        
        // cleanups:
        return () => {
            isMounted = false; // mark as unmounted
            scrollingElm.removeEventListener('scroll', handleScroll, { capture: true });
            descendantsMutationObserver.disconnect();
            descendantsResizeObserver.disconnect();
        };
    }, [scrollingOf, scrollingSelector, scrollingFilter, scrollingInterpolation]); // (re)run the setups & cleanups on every time the scrolling** changes
    
    
    
    // handlers:
    const handleNavigate = useEvent<EventHandler<number[]>>((deepLevels) => {
        // conditions:
        const scrollingElm = (scrollingOf instanceof HTMLElement) ? scrollingOf : scrollingOf?.current;
        if (!scrollingElm) return; // scrollingElm was not set => nothing to do
        
        
        
        const targetChildrenReversed = ((): Dimension[] => {
            const targetChildren: Dimension[] = [];
            
            
            
            let viewport = Viewport.from(scrollingElm);
            for (const targetChildIndex of deepLevels) {
                // inspects:
                const children    = viewport.children(scrollingSelector, scrollingFilter);
                const targetChild = children[targetChildIndex] as (Dimension|undefined);
                if (!targetChild) break; // invalid index => break the iteration
                
                
                
                // updates:
                targetChildren.push(targetChild);
                viewport = targetChild.toViewport();
            } // for
            
            
            
            return targetChildren;
        })()
        .reverse()
        ;
        if (targetChildrenReversed.length === 0) return;
        
        
        
        let [remainingScrollLeft, remainingScrollTop] = [
            targetChildrenReversed[0].offsetLeft,
            targetChildrenReversed[0].offsetTop
        ];
        
        
        
        for (const targetChild of targetChildrenReversed) {
            if (!remainingScrollLeft && !remainingScrollTop) break; // nothing more to scroll => stop the scrolling operation
            
            
            
            const viewport = targetChild.viewport;
            if (!viewport) break; // no parent viewport => nothing more to scroll => stop the scrolling operation
            
            
            
            const [maxDeltaScrollLeft, maxDeltaScrollTop] = (() => {
                const parent = viewport.element;
                
                return [
                    (parent.scrollWidth  - parent.clientWidth ) - parent.scrollLeft,
                    (parent.scrollHeight - parent.clientHeight) - parent.scrollTop,
                ];
            })();
            
            const [deltaScrollLeft, deltaScrollTop] = [
                Math.min(remainingScrollLeft - viewport.offsetLeft, maxDeltaScrollLeft),
                Math.min(remainingScrollTop  - viewport.offsetTop , maxDeltaScrollTop ),
            ];
            
            
            
            // viewport.element.scrollLeft += deltaScrollLeft;
            // viewport.element.scrollTop  += deltaScrollTop;
            viewport.element.scrollBy({
                left     : deltaScrollLeft,
                top      : deltaScrollTop,
                behavior : 'smooth',
            });
            
            
            
            // accumulate the scrolling pos:
            remainingScrollLeft -= deltaScrollLeft;
            remainingScrollTop  -= deltaScrollTop;
        } // for
    });
    
    
    
    // jsx functions:
    const mutateNestedNavscroll = useEvent((nestNavProps: NavscrollProps<TElement>, key: React.Key|null, deepLevelsParent: number[]): React.ReactNode => {
        // rest props:
        const {
            // scrolls:
            scrollingOf            : _scrollingOf,            // remove
            scrollingSelector      : _scrollingSelector,      // remove
            scrollingFilter        : _scrollingFilter,        // remove
            scrollingInterpolation : _scrollingInterpolation, // remove
            
            
            
            // components:
            navComponent           : _navComponent,           // remove
            navscrollComponent     : _navscrollComponent,     // remove
            
            
            
            // children:
            children,
        ...restNestedNavProps} = nestNavProps;
        
        
        
        // jsx:
        /* downgrade nested <Navscroll> to <Nav> */
        return React.cloneElement<NavProps<TElement>>(navComponent,
            // props:
            {
                // other props:
                ...defaultNavProps,
                ...restNavProps,
                ...Object.fromEntries(
                    Object.entries(restNestedNavProps).filter(([, value]) => (value !== undefined)) // prevents `undefined` props overwriting the existing ones
                ),
                ...navComponent.props, // overwrites restNavProps|restNestedNavProps (if any conflics)
                
                
                
                // identifiers:
                key,
            },
            
            
            
            // children:
            navComponent.props.children ?? mutateListItems(children, /*deepLevelsParent: */deepLevelsParent),
        );
    });
    const mutateListItems       = useEvent((children: React.ReactNode, deepLevelsParent: number[]): React.ReactNode[] => {
        let listIndex = -1;
        return (
            flattenChildren(children)
            .map<React.ReactNode>((listItem, childIndex) => {
                // conditions:
                if (!React.isValidElement<ListItemProps<Element>>(listItem)) return listItem; // not a <ListItem> => place it anyway
                
                
                
                // a valid listItem counter:
                listIndex++; // only count of <ListItem>s, ignores of foreign nodes
                
                
                
                const deepLevelsCurrent = [...deepLevelsParent, listIndex];
                
                
                
                // props:
                const listItemProps = listItem.props;
                
                
                
                // defaults:
                const actionCtrl = listItemProps.actionCtrl ?? props.actionCtrl ?? true;
                
                
                
                // children:
                const mutatedListItemChildren = (
                    flattenChildren(listItemProps.children)
                    .map<React.ReactNode>((nestedNavscroll, nestedNavscrollIndex) => {
                        // conditions:
                        if (!React.isValidElement<NavscrollProps<TElement>>(nestedNavscroll)) return nestedNavscroll; // not an         <element> => place it anyway
                        if (nestedNavscroll.type !== navscrollComponent.type)                 return nestedNavscroll; // not a        <Navscroll> => place it anyway
                        if (!!nestedNavscroll.props.scrollingOf)                              return nestedNavscroll; // not a nested <Navscroll> => place it anyway
                        
                        
                        
                        // jsx:
                        return mutateNestedNavscroll(nestedNavscroll.props, nestedNavscroll.key ?? nestedNavscrollIndex, /*deepLevelsParent: */deepLevelsCurrent);
                    })
                );
                
                
                
                // jsx:
                return (
                    /* wrap child with <ListItemWithNavigation> */
                    <ListItemWithNavigation<Element>
                        // other props:
                        {...listItemProps} // steals all listItem's props, so the <Owner> can recognize the <ListItemWithNavigation> as <TheirChild>
                        
                        
                        
                        // identifiers:
                        key={listItem.key ?? childIndex}
                        
                        
                        
                        // positions:
                        deepLevels={deepLevelsCurrent}
                        
                        
                        
                        // behaviors:
                        actionCtrl={actionCtrl}
                        
                        
                        
                        // states:
                        title={`listIndex = ${listIndex} , activeIndices = ${activeIndices.join(', ')}`}
                        active={listItemProps.active ?? (listIndex === activeIndices[deepLevelsCurrent.length - 1])}
                        
                        
                        
                        // handlers:
                        onNavigate={(actionCtrl || undefined) && handleNavigate}
                        
                        
                        
                        // components:
                        listItemComponent={
                            // clone listItem element with (almost) blank props:
                            <listItem.type
                                // identifiers:
                                key={listItem.key}
                                
                                
                                
                                //#region restore conflicting props
                                {...{
                                    ...(('deepLevels'        in listItemProps) ? { deepLevels        : listItemProps.deepLevels        } : undefined),
                                    ...(('actionCtrl'        in listItemProps) ? { actionCtrl        : listItemProps.actionCtrl        } : undefined),
                                    ...(('active'            in listItemProps) ? { active            : listItemProps.active            } : undefined),
                                    ...(('onNavigate'        in listItemProps) ? { onNavigate        : listItemProps.onNavigate        } : undefined),
                                    ...(('listItemComponent' in listItemProps) ? { listItemComponent : listItemProps.listItemComponent } : undefined),
                                }}
                                //#endregion restore conflicting props
                            />
                        }
                    >
                        {mutatedListItemChildren}
                    </ListItemWithNavigation>
                );
            })
        );
    });
    
    
    
    // children:
    // const navComponentChildren = navComponent.props.children;
    // const mutatedChildren = useMemo<React.ReactNode|React.ReactNode[]>(() =>
    //     navComponentChildren
    //     ??
    //     mutateListItems(children, /*deepLevelsParent: */[])
    // , [
    //     // states:
    //     activeIndices,
    //     
    //     
    //     
    //     // variants:
    //     orientation,
    //     
    //     
    //     
    //     // components:
    //     navComponent,
    //     navscrollComponent,
    //     
    //     
    //     
    //     // children:
    //     navComponentChildren,
    //     children,
    // ]);
    
    
    
    // jsx:
    /* <Nav> */
    console.log('activeIndices: ', activeIndices.join(', '));
    return React.cloneElement<NavProps<TElement>>(navComponent,
        // props:
        {
            // other props:
            ...defaultNavProps,
            ...restNavProps,
            ...navComponent.props, // overwrites restNavProps (if any conflics)
        },
        
        
        
        // children:
        navComponent.props.children ?? mutateListItems(children, /*deepLevelsParent: */[]),
    );
};
export {
    Navscroll,
    Navscroll as default,
}

export type { ListStyle, ListVariant }



export interface NavscrollComponentProps<TElement extends Element = HTMLElement>
{
    // components:
    navscrollComponent ?: React.ReactComponentElement<any, NavscrollProps<TElement>>
}
