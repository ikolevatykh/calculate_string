import calc3 from "./utils/calc3";
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

window.renderOriginal = (str, options) => {
  if (!window.renderOriginal.$container) {
    const $div = document.createElement('div');
    $div.className = 'block_visible';
    $div.id = 'block1';

    getWrapper().appendChild($div);

    window.renderOriginal.$container = $div;
  }
  const $container = window.renderOriginal.$container;

  if (options && options.style) {
    Object.keys(options.style).forEach(key => $container.style[key] = options.style[key]);
  }

  $container.innerText = str;
};

window.renderCalc = (str, options) => {
  if (!window.renderCalc.$container) {
    const $div = document.createElement('div');
    $div.className = 'block_visible';
    $div.id = 'block2';
    getWrapper().appendChild($div);

    window.renderCalc.$container = $div;
  }
  const $container = window.renderCalc.$container;

  if (options && options.style) {
    Object.keys(options.style).forEach(key => $container.style[key] = options.style[key]);
  }

  $container.innerText = calc3(str, options).text;
};
