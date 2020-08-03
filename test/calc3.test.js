'use strict';
require('expect-puppeteer');

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

  await page.screenshot({
    path: './test/screenshots/1.png',
    clip: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    }
  });
  await page.screenshot({
    path: './test/screenshots/2.png',
    clip: {
      x: 100,
      y: 0,
      width: 100,
      height: 100,
    }
  });
  await page.screenshot({
    path: './test/screenshots/3.png',
    clip: {
      x: 0,
      y: 0,
      width: 200,
      height: 100,
    }
  });

  expect(1).toBe(1);
});