/**
 * Универсальный алгоритм
 *
 * Возможные оптимизации:
 * - caretRangeFromPoint / caretPositionFromPoint + getClientRects позволяют построчно получать текст.
 * - поиск последнего символа по примерной ширине строки
 * - кеширование: при последовательном вводе считать только концовку
 *
 * TESTS: OK
 */
export default function getLinesUniversal(node) {
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