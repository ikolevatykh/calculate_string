const range = document.createRange();

function calc(str, browser) {
  console.log('calc str, browser')

  if (!calc.$block) {
    calc.$block = document.getElementById('block');
  }
  const $block = calc.$block;
  const arr = str.split('');
  const $fragment = document.createDocumentFragment();
  for (let i = 0; i < arr.length; i += 1) {
    const $span = document.createElement('span');
    $span.append(arr[i]);
    $fragment.append($span);
  }
  $block.innerHTML = '';
  $block.append($fragment);

  // very slow in firefox
  // $block.innerHTML = arr
  //   .map(char => `<span>${char}</span>`)
  //   .join('');

  if (browser === 'firefox') {
    range.setStart($block.firstChild, 0);
    range.setEnd($block.lastChild, 0);
    // range.selectNodeContents($block);
  } else {
    range.selectNode($block);
  }

  const rects = range.getClientRects();
  // for webkit: start with one, because zero element is root block
  let SHIFT_RECT = 1;
  if (browser === 'firefox') {
    SHIFT_RECT = 0;
  }

  const ys = [];
  for (let i = SHIFT_RECT; i < rects.length; i += 1) {
    ys.push(rects[i].y);
  }

  let y = ys[0];
  const arrayStr = [];
  for (let i = 0; i < ys.length; i += 1) {
    if (y !== ys[i]) {
      arrayStr.push('\n');
      y = ys[i];
      arrayStr.push(str[i]);
    } else {
      arrayStr.push(str[i]);
    }
  }

  return arrayStr.join('');
}

window.addEventListener("message", function(e) {
    if (e.data.type === 'calc') {
      console.log('calc');
      const result = calc(e.data.str, e.data.browser);

      window.top.postMessage({
        type: 'calc',
        time: e.data.time,
        str: result,
      }, '*');
    }
  },
  false);