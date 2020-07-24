import calc, {init} from "./calc";
import calc2, {init2} from "./calc2";

const body = `
<style>
  .container {
      width: 100px;
  }
  .block {
      white-space: pre-wrap;
      word-break: break-all;
      width: 100px;
      height: 100px;
      font-size: 12px;
      font-family: sans-serif;
  }
  .block > span {
      display: inline;
  }
</style>
<div class="container">
  <div class="block" id="block" contenteditable></div>
</div>
`;

export default () => {
  return new Promise((resolve) => {
    if (document.getElementById('iframeCalc')) {
      return;
    }

    const $iframe = document.createElement('iframe');
    $iframe.name = 'iframeCalc';
    $iframe.id = 'iframeCalc';
    const script = init + ' ' + init2  + ' ' + calc + ' ' + calc2 + ' init(); init2();';

    document.body.appendChild($iframe);

    $iframe.contentWindow.document.open();
    $iframe.contentWindow.document.write(`<body><script>${script}</script>${body}</body>`);
    $iframe.contentWindow.document.close();

    let isCalc = false;
    let isCalc2 = false;
    window.addEventListener("message", e => {
      if (e.data.type === 'calc_inited') {

        isCalc = true;
        if (isCalc2) {
          resolve($iframe);
        }
      }
    },false);

    window.addEventListener("message", e => {
      if (e.data.type === 'calc2_inited') {
        isCalc2 = true;
        if (isCalc) {
          resolve($iframe);
        }
      }
    },false);
  });
}
