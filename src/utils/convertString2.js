import { detect } from 'detect-browser';

export default str => new Promise(resolve => {
  const now = performance.now();
  window.frames.iframeCalc.postMessage({
    type: 'calc',
    time: now,
    str,
    browser: detect().name,
  }, '*');

  window.addEventListener("message", function(e) {
    if (e.data.type === 'calc' && e.data.time === now) {
      resolve({
        result: e.data.str,
        time: performance.now() - now,
      });
    }
  }, false);
});
