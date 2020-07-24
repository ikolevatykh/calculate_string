import { detect } from 'detect-browser';
import createFrame from "./createFrame";

class Request {
  constructor($iframe) {
    this.$iframe = $iframe;
  }

  send(type, str) {
    const $iframe = this.$iframe;

    return new Promise(resolve => {
      const now = performance.now();

      $iframe.contentWindow.postMessage({
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
  queue = [];
  $iframe = null;
  isInitializing = false;

  add(type, str, resolve) {
    this.queue.push({ type, str, resolve });

    if (this.isInitializing) {
      return;
    }
    if (!this.$iframe) {
      this.isInitializing = true;
      const _this = this;
      createFrame()
        .then($iframe => {
          _this.$iframe = $iframe;
          _this.isInitializing = false
          _this.next();
        });
      return;
    }

    if (this.queue.length === 1) {
      this.next();
    }
  }

  next() {
    if (this.queue.length <= 0) {
      return;
    }

    const { type, str, resolve } = this.queue[0];

    (new Request(this.$iframe))
      .send(type, str)
      .then(data => resolve(data))
      .then(() => this.queue.shift())
      .then(() => this.next());
  }
}

const queue = new Queue();

export default (type, str) => new Promise(resolve => queue.add(type, str, resolve));
