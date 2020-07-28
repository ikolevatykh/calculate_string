import convertString from "./utils/convertString";
import convertString2 from "./utils/convertString2";
import './index.css';

const shuffle = window._.shuffle;
const range = window._.range;

const sum = arr => arr.reduce((memo, item) => memo + item, 0);
const MAX_COUNT = 1000;
const test10 = '1  tet a!_';
const test100 = range(10).map(() => test10).join('');
const test1000 = range(10).map(() => test100).join('');
const testSuits = [test10, test100, test1000];

async function test(options) {
  const {
    initialString,
    type, // calc|calc2,
    iframe,
  } = options;
  const calcTestResults = [];
  let counter = 0;

  while(counter < MAX_COUNT) {
    const str = shuffle(initialString).join('');
    if (iframe === 'iframe') {
      const { time } = await convertString(type, str);
      calcTestResults.push(time);
    } else {
      const { time } = await convertString2(type, str);
      calcTestResults.push(time);
    }
    counter += 1;
  }

  const avg = (sum(calcTestResults) / MAX_COUNT).toFixed(2);
  return new Promise(resolve => resolve(avg));
}

const configs = [
  {
    type: 'calc',
    iframe: 'iframe',
  },
  {
    type: 'calc2',
    iframe: 'iframe',
  },
  {
    type: 'calc',
    iframe: 'no_iframe',
  },
  {
    type: 'calc2',
    iframe: 'no_iframe',
  },
];

async function start() {
  const $body = document.getElementById('root');

  for (const config of configs) {
    for (const suite of testSuits) {
      const value = await test({
        initialString: suite,
        type: config.type,
        iframe: config.iframe,
      });
      const str = `<div>${config.iframe}, ${config.type}, ${suite.length}: ${value}</div>`;
      $body.innerHTML += str;
    }
  }
}

start();
