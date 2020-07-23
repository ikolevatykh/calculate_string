import { detect } from 'detect-browser';

class Request {
  send(type, str) {
    return new Promise(resolve => {
      const now = performance.now();
      window.frames.iframeCalc.postMessage({
        type: type || 'calc2',
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

  add(type, str, resolve) {
    this.queue.push({ type, str, resolve });

    if (this.queue.length === 1) {
      this.next();
    }
  }

  next() {
    if (this.queue.length <= 0) {
      return;
    }

    const { type, str, resolve } = this.queue[0];

    (new Request())
      .send(type, str)
      .then(data => resolve(data))
      .then(() => this.queue.shift())
      .then(() => this.next());
  }
}

const queue = new Queue();

export default (type, str) => new Promise(resolve => queue.add(type, str, resolve));
