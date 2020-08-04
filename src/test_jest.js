import calc3 from "./utils/calc3";
import lodash from 'lodash';
import './index.css';

function getWrapper() {
  if (!getWrapper.$wrapper) {
    const $wrapper = document.createElement('div');
    $wrapper.className = 'wrapper';
    getWrapper.$wrapper = $wrapper;
    document.body.appendChild($wrapper);
  }

  return getWrapper.$wrapper;
}

function renderOriginal(str, options) {
  if (!renderOriginal.$container) {
    const $div = document.createElement('div');
    $div.className = 'block_visible';
    $div.id = 'block1';

    getWrapper().appendChild($div);

    renderOriginal.$container = $div;
  }
  const $container = renderOriginal.$container;

  if (options && options.style) {
    Object.keys(options.style).forEach(key => $container.style[key] = options.style[key]);
  }

  $container.innerText = str;
}

function renderCalc(str, options) {
  if (!renderCalc.$container) {
    const $div = document.createElement('div');
    $div.className = 'block_visible';
    $div.id = 'block2';
    getWrapper().appendChild($div);

    renderCalc.$container = $div;
  }
  const $container = renderCalc.$container;

  if (options && options.style) {
    Object.keys(options.style).forEach(key => $container.style[key] = options.style[key]);
  }

  $container.innerText = calc3(str, options).text;
}

const str = 'a-zA-Z0-9e;r gewfm;lefm l;;fw mfl;wm flwe fnerl kg\n\n\n!@#$ le\'rg nerlg k qler g%^&*()_+';
//const str = `يولد جميع الناس أحرارًا متساوين في الكرامة والحقوق. وقد وهبوا عقلاً وضميرًا وعليهم أن يعامل بعضهم بعضًا بروح الإخاء.`;
// const str = `
// ₠₡₢₣₤₥₦₧₨₩₪₫€₭₮₯2
// 0B0₰₱₲₳₴₵₶₷₸₹₺₻₼₽₾₿
//
// ℀℁ℂ℃℄℅℆ℇ℈℉ℊℋℌℍℎℏ2110ℐℑℒℓ℔ℕ№℗℘ℙℚℛℜℝ℞℟2120℠℡™℣ℤ℥Ω℧ℨ℩KÅ
// ℬℭ℮ℯ2130ℰℱℲℳℴℵℶℷℸℹ℺℻ℼℽℾℿ2140⅀⅁⅂⅃⅄ⅅⅆⅇⅈⅉ⅊⅋⅌⅍ⅎ⅏2150⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅟2160ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅬⅭⅮⅯ2170ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅺⅻⅼⅽⅾⅿ
// `;

const config = {
  width: lodash.range(100, 101, 1),
  height: 400,
  fontSize: lodash.range(12, 32, 1),
  fontFamily: [
    // 'sans-serif',
    // 'Arial',
    // 'Arial Black',
    // 'Comic Sans MS',
    // 'Courier New',
    // 'Georgia',
    // 'Impact',
    'Times New Roman',
    // 'Trebuchet MS',
    // 'Verdana',
  ],
  fontWeight: ['bold', 'normal'],
  fontStyle: ['italic', 'normal'],
  textDecoration: ['underline', 'none'],
}
const defOptions = {
  style: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  }
};

window.run = function run(params) {
  const style = {
    ...defOptions.style,
    height: `${config.height}px`,
    width: `${config.width[params[0]]}px`,
    fontSize: `${config.fontSize[params[1]]}px`,
    fontFamily: config.fontFamily[params[2]],
    fontWeight: config.fontWeight[params[3]],
    fontStyle: config.fontStyle[params[4]],
    textDecoration: config.textDecoration[params[5]],
  }
  const options = { style };

  renderOriginal(str, options);
  renderCalc(str, options);

  return config.width[params[0]];
}

