import {
    default as React,
    useState,
} from 'react';
// import logo from './logo.svg';
import './App.css';
import {
    ButtonIcon,
} from '@reusable-ui/button-icon'
import {
    Styles,
    HeadPortal,
} from '@cssfn/cssfn-react'



function App() {
    const [value, setValue] = useState(0);
    const handleTriggerRerender = () => {
        setValue(value + 1);
    };
    
    const [pressed, setPressed] = useState(false);
    const handleTogglePressed = () => {
        setPressed(!pressed);
    };
    
    
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
                <article className='actions'>
                    <ButtonIcon theme='primary' icon='face'>
                        test &lt;Button&gt;
                    </ButtonIcon>
                    <ButtonIcon theme='primary' icon='whatsapp'>
                        test &lt;Button&gt;
                    </ButtonIcon>
                    <ButtonIcon theme='primary' pressed={pressed || undefined} onClick={handleTogglePressed} icon='elderly'>
                        toggle press
                    </ButtonIcon>
                    <ButtonIcon theme='primary' icon='whatsapp' mild={true}>
                        test &lt;Button&gt;
                    </ButtonIcon>
                    <ButtonIcon theme='primary' icon='whatsapp'>
                        test &lt;Button&gt;
                    </ButtonIcon>
                    <ButtonIcon theme='primary' icon='instagram'>
                        test &lt;Button&gt;
                    </ButtonIcon>
                    <ButtonIcon theme='primary' icon='facebook'>
                        test &lt;Button&gt;
                    </ButtonIcon>
                    <ButtonIcon theme='primary' icon='google'>
                        test &lt;Button&gt;
                    </ButtonIcon>
                    <ButtonIcon theme='primary' icon='twitter'>
                        test &lt;Button&gt;
                    </ButtonIcon>
                    <ButtonIcon theme='primary' icon='apple'>
                        test &lt;Button&gt;
                    </ButtonIcon>
                </article>
            </div>
        </>
    );
}

export default App;
