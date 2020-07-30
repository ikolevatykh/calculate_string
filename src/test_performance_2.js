import convertString4 from "./utils/convertString4";
import './index.css';

const shuffle = window._.shuffle;
const range = window._.range;

const sum = arr => arr.reduce((memo, item) => memo + item, 0);
const MAX_COUNT = 1000;
const test10 = '1  tet a!_';
const test100 = `a b c d e f g h i j k k l m n o p q r s t u v w x y z !@#$%^&*()_+1234567890-=<>?/.,\\§[]{}<>!"№%:,%№`;
const test1000 = range(10).map(() => test100).join('');
const testSuits = [test10, test100, test1000];

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
    const { time } = await convertString4(str, { style });
    calcTestResults.push(time);
    counter += 1;
  }

  const avg = (sum(calcTestResults) / MAX_COUNT).toFixed(2);
  return new Promise(resolve => resolve(avg));
}

async function start() {
  const $body = document.getElementById('root');
    for (const suite of testSuits) {
      const value = await test({
        initialString: suite,
      });
      const str = `<div>${suite.length}: ${value}</div>`;
      $body.innerHTML += str;
    }
}

start();
