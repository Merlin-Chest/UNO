export class TaskQueue {
  tasks: Function[]
  constructor() {
    this.tasks = [];
  }
  addTask(fn: Function) {
    if (typeof fn !== 'function') return;
    this.tasks.push(fn);
  }
  async exec() {
    const len = this.tasks.length;
    for (let i = 0; i < len; i++) {
      const task = this.tasks.shift();
      task && await task();
    }
  }
}
