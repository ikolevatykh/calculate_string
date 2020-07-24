function calc(str, browser) {
  const range = document.createRange();
  if (!calc.$block) {
    calc.$block = document.getElementById('block');
  }
  const $block = calc.$block;
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

  let SHIFT_RECT = 1;

  if (browser === 'firefox') {
    range.setStart($block.firstChild, 0);
    range.setEnd($block.lastChild, 0);
    SHIFT_RECT = 0;
  } else if (browser === 'edge') {
    range.selectNodeContents($block);
    SHIFT_RECT = 0;
  } else if (browser === 'ie') {
    range.selectNodeContents($block);
    const rects = range.getClientRects();
    const linesCount = rects.length;

    let sumWidth = 0;
    for (let i = 0; i < linesCount; i += 1) {
      sumWidth += rects.item(i).width;
    }
    const avgSymbolWidth = sumWidth / arr.length;

    const resultIndexes = [];
    // высота целевой строки (для первой итерации она - первая)
    let top = Math.floor(rects.item(0).top);
    // предыдущий последний индекс
    let prevLastIndex = 0;

    for (let i = 0; i < linesCount - 1; i += 1) {
      // ширина строки (здесь и делаее - текущей)
      const lineWidth = rects.item(i).width;
      // примерное количество символов в строке
      const approximateSymbolsCount = lineWidth / avgSymbolWidth;
      // примерный последний индекс в строке
      let index = Math.min(Math.max(Math.floor(approximateSymbolsCount) + prevLastIndex - 1, 0), str.length - 1);
      // примерный последний элемент в строеке
      let $el = $block.childNodes.item(index);
      const rect = $el.getBoundingClientRect();
      let topEl = Math.floor(rect.top);
      const direction = topEl <= top ? 1 : -1;

      let finish = false;
      let $prevEl = $el;
      let prevElTop = topEl;
      while (!finish) {
        index += direction;
        const $nextEl = $block.childNodes.item(index);
        if (!$nextEl) {
          finish = true;
          break;
        }
        const rect = $nextEl.getBoundingClientRect();
        const topNextEl = Math.floor(rect.top);

        if (direction > 0) { // идем вперёд
          if (topNextEl > top) { // ожидаем переход на след строку после целевой
            finish = true;
            if ($prevEl.innerText[0] !== '\n' && $prevEl.innerHTML !== '<br>') {
              resultIndexes.push(index - 1);
            }
            prevLastIndex = index - 1;
            top = topNextEl; // top смещаем на след строку
            break;
          }
        } else { // идем назад
          if (topNextEl === top) { // ожидаем попадаения на целевую строку
            finish = true;
            if ($nextEl.innerText[0] !== '\n' && $nextEl.innerHTML !== '<br>') {
              resultIndexes.push(index);
            }
            prevLastIndex = index;
            top = prevElTop; // top смещаем на след строку
            break;
          }
        }
        $prevEl = $nextEl;
        prevElTop = topNextEl;
      }
    }

    let result = resultIndexes.reduce(function (memo, value, index, arr) {
      if (index === 0) {
        memo += str.substring(0, value + 1);
      } else {
        memo += str.substring(arr[index - 1] + 1, value + 1);
      }

      if (index !== str.length - 1) {
        memo += '\n';
      }

      return memo;
    }, '');
    result += str.substring(resultIndexes[resultIndexes.length - 1] + 1, str.length);

    return result;
  } else {
    range.selectNode($block);
  }

  const rects = range.getClientRects();

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

export const init = () => {
  window.addEventListener("message", function (e) {
    if (e.data.type === 'calc') {
        const result = calc(e.data.str, e.data.browser);

        window.top.postMessage({
          type: 'calc',
          time: e.data.time,
          str: result,
        }, '*');
      }
    },
  false);

  window.top.postMessage({ type: 'calc_inited' }, '*');
}

export default calc;