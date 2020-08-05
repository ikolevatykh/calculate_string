export default function getLinesUniversalOptimized(node) {
  const str = node.textContent;
  const range = document.createRange();
  range.selectNodeContents(node);
  const rects = range.getClientRects();
  const linesCount = rects.length;

  let sumWidth = 0;
  for (let i = 0; i < linesCount; i += 1) {
    sumWidth += rects.item(i).width;
  }
  const avgSymbolWidth = sumWidth / str.length;

  const resultIndexes = [];
  // высота целевой строки (для первой итерации она - первая)
  let top = Math.floor(rects.item(0).top);
  // предыдущий последний индекс
  let prevLastIndex = 0;

  debugger;

  for (let i = 0; i < linesCount - 1; i += 1) {
    // ширина строки (здесь и далее - текущей)
    const lineWidth = rects.item(i).width;
    // примерное количество символов в строке
    const approximateSymbolsCount = lineWidth / avgSymbolWidth;
    // примерный последний индекс в строке
    let index = Math.min(Math.max(Math.floor(approximateSymbolsCount) + prevLastIndex - 1, 0), str.length - 1);
    // примерный последний элемент в строке
    range.setStart(node, index);
    range.setEnd(node, index + 1);

    let topLetterPrev = Math.floor(range.getBoundingClientRect().top);
    const direction = topLetterPrev <= top ? 1 : -1;

    let finish = false;
    while (!finish) {
      index += direction;
      if (index > str.length - 1) {
        if (direction === 1) {
          finish = true;
          break;
        }
      }
      // очередной символ
      range.setStart(node, index);
      range.setEnd(node, index + 1);
      const rect = range.getBoundingClientRect();
      const topLetterCurrent = Math.floor(rect.top);

      if (direction > 0) { // идем вперёд
        if (topLetterCurrent > top) { // ожидаем переход на след строку после целевой
          finish = true;

          // если предыдущий символ строке был пользовательским переносом
          if (str[index - 1] !== '\n') {
            resultIndexes.push(index - 1);
          }
          prevLastIndex = index - 1;
          top = topLetterCurrent; // top смещаем на след строку
          break;
        }
      } else { // идем назад
        if (topLetterCurrent === top) { // ожидаем попадания на целевую строку
          finish = true;
          // если следующий символ в строке не пользовательский перенос
          if (str[index + 1] !== '\n' ) {
            resultIndexes.push(index);
          }
          prevLastIndex = index;
          top = topLetterPrev; // top смещаем на след строку
          break;
        }
      }

      topLetterPrev = topLetterCurrent;
    }
  }

  return resultIndexes;
}