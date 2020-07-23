function calc2(str, browser) {
  if (!calc2.$block) {
    calc2.$block = document.getElementById('block');
  }
  const $block = calc2.$block;
  const arr = str.split('');
  const $fragment = document.createDocumentFragment();
  for (let i = 0; i < arr.length; i += 1) {
    const $span = document.createElement('span');
    if ($span.append) {
      $span.append(arr[i]);
    } else {
      $span.innerText = arr[i];
    }
    $fragment.appendChild($span);
  }
  $block.innerHTML = '';
  $block.appendChild($fragment);

  let SHIFT_RECT = 0;

  const rects = [];
  for (let i = 0; i < $block.childNodes.length; i += 1) {
    rects.push($block.childNodes.item(i).getBoundingClientRect());
  }

  const ys = [];
  for (let i = SHIFT_RECT; i < rects.length; i += 1) {
    ys.push(rects[i].top);
  }

  let y = ys[0];
  const arrayStr = [];
  for (let i = 0; i < ys.length; i += 1) {
    if (y !== ys[i]) {
      if (str[i - 1] !== '\n') {
        arrayStr.push('\n');
      }
      y = ys[i];
      arrayStr.push(str[i]);
    } else {
      arrayStr.push(str[i]);
    }
  }

  return arrayStr.join('');
}

window.addEventListener("message", function(e) {
    if (e.data.type === 'calc2') {
      const result = calc2(e.data.str, e.data.browser);

      window.top.postMessage({
        type: 'calc',
        time: e.data.time,
        str: result,
      }, '*');
    }
  },
  false);