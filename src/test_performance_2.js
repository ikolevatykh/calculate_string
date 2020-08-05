import BreakDetectQueue from "./utils/BreakDetectQueue";
import './index.css';

const shuffle = window._.shuffle;
const range = window._.range;

const sum = arr => arr.reduce((memo, item) => memo + item, 0);
const MAX_COUNT = 5;
const test10 = '1  tet a!_';
const test100 = `a b c d e f g h i j k k l m n o p q r s t u v w x y z !@#$%^&*()_+1234567890-=<>?/.,\\§[]{}<>!"№%:,%№`;
const test1000 = range(10).map(() => test100).join('');
const testSuits = [
  // test10,
  // test100,
  test1000,
];

const style = {
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  width: '1000px',
  fontSize: '16px',
  fontFamily: 'sans-serif',
};

async function test(options) {
  const { initialString } = options;
  const calcTestResults = [];
  let counter = 0;

  while(counter < MAX_COUNT) {
    const str = shuffle(initialString).join('');
    const { time, performanceLineBreak } = await BreakDetectQueue(str, { style });
    calcTestResults.push({ time, performanceLineBreak });
    counter += 1;
  }

  const avgFull = (sum(calcTestResults.map(item => item.time)) / MAX_COUNT).toFixed(2);
  const avgLineBreak = (sum(calcTestResults.map(item => item.performanceLineBreak)) / MAX_COUNT).toFixed(2);
  return new Promise(resolve => resolve({
    avgFull,
    avgLineBreak,
  }));
}

async function start() {
  const $body = document.getElementById('root');
  $body.innerHTML += `<table><thead><tr><th>Length</th><th>avgFull</th><th>avgLineBreak</th></tr></thead><tbody id="tbody"></tbody></table>`;
  const $tbody = document.getElementById('tbody');
  for (const suite of testSuits) {
    const {
      avgFull,
      avgLineBreak,
    } = await test({
      initialString: suite,
    });
    $tbody.innerHTML += `<tr><td>${suite.length}</td><td>${avgFull}</td><td>${avgLineBreak}</td></tr>`
  }
}

start();
