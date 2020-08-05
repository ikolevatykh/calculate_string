'use strict';
const fs = require('fs');
const lodash = require('lodash');
require('expect-puppeteer');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;

beforeAll(async () => {
  await page.goto('http://localhost:5000/');
});

// afterEach(() => {
//
// });

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
const str = 'a-zA-Z0-9e;r gewfm;lefm l;;fw mfl;wm flwe fnerl kg\n\n\n!@#$ le\'rg nerlg k qler g%^&*()_+';
// const str = `يولد جميع الناس أحرارًا متساوين في الكرامة والحقوق. وقد وهبوا عقلاً وضميرًا وعليهم أن يعامل بعضهم بعضًا بروح الإخاء.`;
// const str = `
// ₠₡₢₣₤₥₦₧₨₩₪₫€₭₮₯2
// 0B0₰₱₲₳₴₵₶₷₸₹₺₻₼₽₾₿
//
// ℀℁ℂ℃℄℅℆ℇ℈℉ℊℋℌℍℎℏ2110ℐℑℒℓ℔ℕ№℗℘ℙℚℛℜℝ℞℟2120℠℡™℣ℤ℥Ω℧ℨ℩KÅ
// ℬℭ℮ℯ2130ℰℱℲℳℴℵℶℷℸℹ℺℻ℼℽℾℿ2140⅀⅁⅂⅃⅄ⅅⅆⅇⅈⅉ⅊⅋⅌⅍ⅎ⅏2150⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅟2160ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅬⅭⅮⅯ2170ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅺⅻⅼⅽⅾⅿ
// `;

const cases = (() => {
  const result = [];
  let index = 0;
  // Грязно, но зато - быстро
  // Для корректного алгоритма нужно глянуть на гусеничный граф (дерево)
  for (let a = 0; a < config.width.length; a += 1) {
    for (let b = 0; b < config.fontSize.length; b += 1) {
      for (let c = 0; c < config.fontFamily.length; c += 1) {
        for (let d = 0; d < config.fontWeight.length; d += 1) {
          for (let e = 0; e < config.fontStyle.length; e += 1) {
            for (let f = 0; f < config.textDecoration.length; f += 1) {
              result.push([{
                index,
                params: [a, b, c, d, e, f],
              }, 0, 0]);
              index += 1;
            }
          }
        }
      }
    }
  }

  return result;
})();

const COUNT = cases.length;

console.log(`test cases: ${COUNT}`);

describe(`test cases: ${COUNT}`, () => {
  const startTime = Date.now();

  test.each(cases)(
    "test",
    async (firstArg, secondArg, expectedResult) => {
      // debugger;
      const { params, index } = firstArg;
      if (index % 10 === 0) {
        const currentTime = Date.now();
        const leaveSec = Math.floor((currentTime - startTime) / 1000);
        const speed = index / leaveSec * 60;
        const estimateTimeMin = (COUNT - index) / speed;
        const estimateTimeHours = Math.floor(estimateTimeMin / 60).toFixed(1);

        const str = `
        count: ${index}
        leave (s): ${leaveSec} seconds
        leave (%): ${(index / COUNT * 100).toFixed(4)}%
        speed, items per minutes:  ${speed.toFixed(2)}
        estimate time, minutes: ${estimateTimeMin.toFixed(2)}
        estimate time, hours: ${estimateTimeHours}
        `;
        console.log(str);
      }

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
      const options = { ...defOptions, style };
      const width = config.width[params[0]];

      await page.evaluate((...args) => window.run(...args), str, options);
      const png1 = await page.screenshot({
        type: 'png',
        encoding: 'binary',
        clip: {
          width: width + 5,
          x: 0,
          y: 0,
          height: config.height,
        }
      });

      const png2 = await page.screenshot({
        type: 'png',
        encoding: 'binary',
        clip: {
          width: width + 5,
          x: width + 10,
          y: 0,
          height: config.height,
        }
      });

      const img1 = PNG.sync.read(png1);
      const img2 = PNG.sync.read(png2);

      // смещение для шрифтов, которые вылазят за границу
      const SHIFT = 5;
      let diff;
      try {
        // threshold: точность. Ставим минимальную, начертание немного меняется при ручном переносе.
        diff = pixelmatch(img1.data, img2.data, null, width + SHIFT, config.height, {threshold: 1});
      } catch (e) {
        const png3 = await page.screenshot({
          type: 'png',
          encoding: 'binary',
          clip: {
            width: 800,
            x: 0,
            y: 0,
            height: 800,
          }
        });

        fs.writeFileSync('test/screenshots/img1.png', png1);
        fs.writeFileSync('test/screenshots/img2.png', png2);
        fs.writeFileSync('test/screenshots/img3.png', png3);
        process.exit(-1);
      }

      if (diff > 0) {
        fs.writeFileSync(`test/screenshots/img${index}-0.png`, png1);
        fs.writeFileSync(`test/screenshots/img${index}-1.png`, png2);
        console.log('error value', params);
        console.log('error style', style);
      }

      expect(0).toBe(diff);
    }
  );
});
