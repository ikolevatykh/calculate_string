import calc3 from "./utils/BreakDetect/BreakDetect";
import './index.css';

function getWrapper() {
  if (!getWrapper.$wrapper) {
    const $wrapper = document.createElement('div');
    $wrapper.className = 'wrapper';
    getWrapper.$wrapper = $wrapper;
    document.body.appendChild($wrapper);
  }

  return getWrapper.$wrapper;
}

function renderOriginal(str, options) {
  if (!renderOriginal.$container) {
    const $div = document.createElement('div');
    $div.className = 'block_visible';
    $div.id = 'block1';

    getWrapper().appendChild($div);

    renderOriginal.$container = $div;
  }
  const $container = renderOriginal.$container;

  if (options && options.style) {
    Object.keys(options.style).forEach(key => $container.style[key] = options.style[key]);
  }

  $container.innerText = str;
}

function renderCalc(str, options) {
  if (!renderCalc.$container) {
    const $div = document.createElement('div');
    $div.className = 'block_visible';
    $div.id = 'block2';
    getWrapper().appendChild($div);

    renderCalc.$container = $div;
  }
  const $container = renderCalc.$container;

  if (options && options.style) {
    Object.keys(options.style).forEach(key => $container.style[key] = options.style[key]);
  }

  $container.innerText = calc3(str, options).text;
}

window.run = function run(str, options) {
  renderOriginal(str, options);
  renderCalc(str, options);
}

