'use strict';
const fs = require('fs');
require('expect-puppeteer');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;

beforeEach(async () => {
  await page.goto('http://localhost:5000/');
});

afterEach(() => {
  // удалить DOM
});

test('render', async () => {
  await page.evaluate(() => {
    const options = { style: {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        width: '100px',
        fontSize: '16px',
        fontFamily: 'sans-serif',
      } };

    window.renderOriginal('test', options);
  });
  await page.evaluate(() => {
    const options = { style: {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        width: '100px',
        fontSize: '16px',
        fontFamily: 'sans-serif',
      } };

    window.renderCalc('test', options);
  });

  const png1 = await page.screenshot({
    // path: './test/screenshots/1.png',
    type: 'png',
    encoding: 'binary',
    clip: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    }
  });
  const png2 = await page.screenshot({
    // path: './test/screenshots/2.png',
    type: 'png',
    encoding: 'binary',
    clip: {
      x: 100,
      y: 0,
      width: 100,
      height: 100,
    }
  });

  const img1 = PNG.sync.read(png1);
  const img2 = PNG.sync.read(png2);

  let diff = pixelmatch(img1.data, img2.data, null, 100, 100, {threshold: 0.0});

  if (diff > 0) {
    fs.writeFileSync('test/screenshots/img1.png', png1);
    fs.writeFileSync('test/screenshots/img2.png', png2);
  }

  expect(0).toBe(diff);
});