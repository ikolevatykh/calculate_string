import './index.css';
import convertString3 from "./utils/convertString3";
const range = window._.range;

const test10 = '1  tet a!_';
const test100 = range(10).map(() => test10).join('');
const test1000 = range(10).map(() => test100).join('');
const testSuits = [...test10, ...test100, ...test1000];
const testSuit = test100;

async function test(){
  const style = {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    width: '1000px',
    fontSize: '16px',
    fontFamily: 'sans-serif',
  };

  const $blockView = document.getElementById('blockView');
  const $sourceDiv = document.createElement('div');
  $sourceDiv.id = 'source_id';
  $sourceDiv.innerText = testSuit;
  $blockView.value = testSuit;
  Object.keys(style).forEach(key => {
    $sourceDiv.style[key] = style[key];
    $blockView.style[key] = style[key];
  });
  $blockView.style.margin = '0';
  $blockView.style.padding = '0';
  document.body.prepend($sourceDiv);

  let breaksOriginalCount = 0;
  let prevOriginalHeight = $sourceDiv.getBoundingClientRect().height;
  let positionsDP;
  for (let i = 1000; i > 5; i -= 1) {
    const width = `${i}px`;
    $sourceDiv.style.width = width;
    $blockView.style.width = width;

    const { positions } = await convertString3(testSuit, {
      style: {
        ...style,
        width,
      },
    });
    positionsDP = positions;

    const height = $sourceDiv.getBoundingClientRect().height;
    $blockView.style.height = `${height}px`;
    if (height !== prevOriginalHeight) {
      // не отслеживается переход сразу на 2 строки.
      // как?
      breaksOriginalCount += 1;
      prevOriginalHeight = height;
    }

    if (breaksOriginalCount !== positions.length) {
      console.log('fail');
      break;
    }
  }

  console.log('breaksOriginalCount', breaksOriginalCount);
  console.log('positionsDP', positionsDP);
}

test();