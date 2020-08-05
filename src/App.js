import React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'fast-text-encoding/text';
import BreakDetectQueue from './utils/BreakDetect/BreakDetectQueue';
import './App.css';

const style = {
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  width: '100px',
  fontSize: '16px',
  fontFamily: 'sans-serif',
};

function App() {
  const [str, setStr] = React.useState('');
  const [convertedStr, setConvertedStr] = React.useState('');
  const [ms, setMS] = React.useState(0);

  const handleChangeInput = e => {
    setStr(e.target.value);
    if (e.target.value === '') {
      setConvertedStr(e.target.value);
      setMS(0);
      return;
    }

    BreakDetectQueue(e.target.value, { style }).then(data => {
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
    </div>
  );
}

export default App;
