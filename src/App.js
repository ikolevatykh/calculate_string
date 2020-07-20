import React from 'react';
import convertString from './utils/convertString2';
import './App.css';


function App() {
  const [str, setStr] = React.useState('');
  const [convertedStr, setConvertedStr] = React.useState('');
  const [ms, setMS] = React.useState(0);

  const handleChangeInput = e => {
    setStr(e.target.value);
    convertString(e.target.value).then(({ result, time }) => {
      setConvertedStr(result);
      setMS(time);
    });
  }

  return (
    <div className="App">
      <div className="input-container">
        <textarea value={str} onChange={handleChangeInput} />
      </div>
      <div className="output-container">
        <textarea defaultValue={convertedStr}/>
      </div>
      <div>calc time: {ms}ms</div>
    </div>
  );
}

export default App;
