import {
    default as React,
    useCallback,
    useState,
} from 'react';
// import logo from './logo.svg';
import './App.css';
import {
    DropdownButton,
} from '@reusable-ui/dropdown-button'
import {
    Styles,
    HeadPortal,
} from '@cssfn/cssfn-react'
import { DropdownActiveChangeEvent } from '@reusable-ui/dropdown';



function App() {
    const [value, setValue] = useState(0);
    const handleTriggerRerender = () => {
        setValue(value + 1);
    };
    
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const handleActiveChange = useCallback((event: DropdownActiveChangeEvent) => {
        console.log('onActiveChange', event.newActive, event.closeType);
        setShowDropdown(event.newActive);
    }, []);
    
    
    return (
        <>
            <HeadPortal>
                <Styles />
            </HeadPortal>
            <div className="App">
                <article className='actions'>
                    <button onClick={handleTriggerRerender}>
                        Trigger re-render whole app
                    </button>
                </article>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea inventore debitis, tempore sapiente possimus ratione velit voluptatibus quidem accusamus odio illo voluptate esse delectus et fugiat voluptatum voluptatem. Fuga, provident.</p>
                <DropdownButton theme='primary' active={showDropdown} onActiveChange={handleActiveChange}>
                    <div tabIndex={-1}>
                        <p>Lorem ipsum dolor sit amet consectetur</p>
                        <p>Lorem ipsum dolor sit amet consectetur</p>
                        <p>Lorem ipsum dolor sit amet consectetur</p>
                    </div>
                </DropdownButton>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea inventore debitis, tempore sapiente possimus ratione velit voluptatibus quidem accusamus odio illo voluptate esse delectus et fugiat voluptatum voluptatem. Fuga, provident.</p>
            </div>
        </>
    );
}

export default App;
