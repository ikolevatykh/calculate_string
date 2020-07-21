import { detect } from 'detect-browser';

class Request {
  send(str) {
    return new Promise(resolve => {
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
    })
  }
}

class Queue {
  queue = []

  add(str, resolve) {
    this.queue.push({ str, resolve });

    if (this.queue.length === 1) {
      this.next();
    }
  }

  next() {
    if (this.queue.length <= 0) {
      return;
    }

    const { str, resolve } = this.queue[0];

    (new Request())
      .send(str)
      .then(data => resolve(data))
      .then(() => this.queue.shift())
      .then(() => this.next());
  }
}

const queue = new Queue();

export default str => new Promise(resolve => queue.add(str, resolve));
