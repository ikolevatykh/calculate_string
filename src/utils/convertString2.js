import calc from "./calc";
import calc2 from "./calc2";

class Request {
  send(type, str) {
    return new Promise(resolve => {
      let result;
      let time;

      const now = performance.now();
      if (type === 'calc') {
        result = calc(str);
      } else {
        result = calc2(str);
      }
      time = performance.now() - now;

      resolve({ result, time });
    });
  }
}

class Queue {
  queue = [];
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
