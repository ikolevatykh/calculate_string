function calc3(str, options) {
  if (!calc3.$block) {
    const $div = document.createElement('div');
    $div.className = 'block';
    $div.id = 'block';
    document.body.appendChild($div);
    calc3.$block = $div;
  }
  const $block = calc3.$block;
  if (options && options.style) {
    Object.keys(options.style).forEach(key => $block.style[key] = options.style[key]);
  }
  $block.innerText = str;

  const timeStart = performance.now();

  let shift = 0;
  const lineBreaks = [].reduce.call($block.childNodes, (memo, node) => {
    let data = [];
    if (node.nodeType === 3) {
      data = getLines(node).map(pos => pos + shift);
      shift = shift + node.textContent.length;
    } else {
      // если node.nodeName === 'BR', то это поль разрыв, его мы не учитываем
      shift += 1;
    }
    return [...memo, ...data];
  }, []);

  // const lineBreaks = getLines($block.childNodes[0]);
  let performanceLineBreak = performance.now() - timeStart;

  let text = lineBreaks.reduce((memo, value, index, arr) => {
    const startPos = index === 0 ? 0 : arr[index - 1] + 1;
    memo += str.substring(startPos, value + 1);

    if (index !== str.length - 1) {
      memo += '\n';
    }

    return memo;
  }, '');
  text += str.substring(lineBreaks[lineBreaks.length - 1] + 1, str.length);

  return {
    text: text,
    positions: lineBreaks,
    performanceLineBreak,
  };
}


/**
 * Универсальный алгоритм
 *
 * Возможные оптимизации:
 * - caretRangeFromPoint / caretPositionFromPoint + getClientRects позволяют построчно получать текст.
 * - поиск последнего символа по примерной ширине строки
 * - кеширование: при последовательном вводе считать только концовку
 */
function getLines(node) {
  const str = node.textContent;
  const strLength = str.length;
  const ranges = [];
  let range;
  for (let i = 0; i < strLength; i += 1) {
    range = document.createRange();
    range.setStart(node, i);
    if (i < strLength) {
      range.setEnd(node, i + 1);
    }
    ranges.push(range);
  }

  // получение всех элементов, линейная сложность
  // браузер не оптимизирует такую операцию
  const bottoms = [];
  for (let i = 0; i < ranges.length; i += 1) {
    bottoms.push(ranges[i].getBoundingClientRect().bottom);
  }

  const lineBreaks = [];
  for (let i = 1; i <= bottoms.length; i += 1) {
    if (bottoms[i] > bottoms[i - 1]) {
      if (str[i - 1] !== '\n') {
        lineBreaks.push(i - 1);
      }
    }
  }

  return lineBreaks;
}

export default calc3;