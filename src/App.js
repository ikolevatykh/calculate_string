import React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'fast-text-encoding/text';
import convertString2 from './utils/convertString2';
import './App.css';

function App() {
  const [str, setStr] = React.useState('');
  const [convertedStr, setConvertedStr] = React.useState('');
  const [ms, setMS] = React.useState(0);
  const [type, setType] = React.useState('calc');
  const handleChangeMode = () => setType(type === 'calc' ? 'calc2' : 'calc');

  const handleChangeInput = e => {
    setStr(e.target.value);
    if (e.target.value === '') {
      setConvertedStr(e.target.value);
      setMS(0);
      return;
    }

    convertString2(type, e.target.value).then(data => {
      const { result, time } = data;
      setConvertedStr(result);
      setMS(time);
    });
  }

  return (
    <div className="App">
      <div className="input-container">
        <h3>Input</h3>
        <textarea value={str} onChange={handleChangeInput} />
      </div>
      <div className="output-container">
        <h3>Output</h3>
        <textarea value={convertedStr} />
      </div>
      <div>calc time: {ms}ms</div>
      <div>
        <p>current mode: {type === 'calc' ? 'with createRange' : 'only getBoundingClientRect for every letters\' span'}</p>
        <p><button onClick={handleChangeMode}>Switch mode</button></p>
      </div>
    </div>
  );
}

export default App;
