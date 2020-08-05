import breakDetect from "./BreakDetect";

class Request {
  send(str, options) {
    return new Promise(resolve => {
      let result;
      let time;

      const now = performance.now();
      result = breakDetect(str, options);
      const { text, positions, performanceLineBreak } = result;
      time = performance.now() - now;
      resolve({ result: text, time, positions, performanceLineBreak });
    });
  }
}

 class Queue {
  queue = [];
  add(str, options, resolve) {
    this.queue.push({ str, options, resolve });

    if (this.queue.length === 1) {
      this.next();
    }
  }

  next() {
    if (this.queue.length <= 0) {
      return;
    }

    const { options, str, resolve } = this.queue[0];

    (new Request())
      .send(str, options)
      .then(data => resolve(data))
      .then(() => this.queue.shift())
      .then(() => this.next());
  }
}

const queue = new Queue();

export default (str, options) => new Promise(resolve => queue.add(str, options, resolve));
