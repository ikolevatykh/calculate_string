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

class BreakDetect {
  static $container = null;

  static getContainer() {
    if (!BreakDetect.$container) {
      BreakDetect.createContainer();
    }

    return BreakDetect.$container;
  }

  static createContainer() {
    if (!BreakDetect.$container) {
      BreakDetect.$container = document.createElement('div');
      BreakDetect.$container.className = 'block';
      BreakDetect.$container.id = 'block';
      document.body.appendChild(BreakDetect.$container);
    }
  }

  static updateContainerStyles(style = {}) {
    const $container = BreakDetect.getContainer();

    Object.keys(style)
      .forEach(key => $container.style[key] = style[key]);
  }

  static setText(str) {
    const $container = BreakDetect.getContainer();

    $container.innerText = str;
  }

  static getLineBreaks(str = '', options = {}) {
    const $container = BreakDetect.getContainer();

    BreakDetect.updateContainerStyles(options.style);
    BreakDetect.setText(str);

    const timeStart = performance.now();
    // Смещение для каждого следующего TEXT
    let shift = 0;
    // Перебор объектов TEXT в DIV
    const lineBreaks = [].reduce.call($container.childNodes, (memo, node) => {
      if (node.nodeType === 3) {
        // Получение line break
        const data = getLines(node).map(pos => pos + shift);
        shift = shift + node.textContent.length;
        memo = memo.concat(data);
      } else {
        // пользовательский разрыв
        // если node.nodeName === 'BR', то это пользовательский разрыв, его мы не учитываем
        // в ручном режиме появляются node.nodeName === 'DIV': это новая строка в contenteditable DIV.
        //   она может содержать <BR> или TEXT
        shift += 1;
      }
      return memo;
    }, []);
    let performanceLineBreak = performance.now() - timeStart;

    // Склеиваем строку.
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
      positions: lineBreaks,  // НЕ содержит пользовательских переносов
      performanceLineBreak,   // оценка производительность функции вычисления переносов
    };
  }
}

export { BreakDetect };

export default BreakDetect.getLineBreaks;
