import { useEffect, useState } from 'react';
// 外部套件
import axios from 'axios';

// 內部套件
import logo from './assets/logo.svg';
import './assets/index.css';
import Input from './components/input';
import './assets/all.scss';

function App() {
  const [text, setText] = useState('');
  const onChangeHandler = (e) => {
    setText(e.target.value);
  }
  useEffect(() => {(async () => {
    const path = process.env.REACT_APP_PATH;
    const result = await axios.get(path);
    console.log(result);
      })();
    }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
          lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Input id="sampleText" text="這是一個input"
          value={text} onChangeHandler={onChangeHandler}></Input>
          {text}
        <button type="button" className="btn btn-primary">Primary</button>
      </header>
    </div>
  );
}

export default App;