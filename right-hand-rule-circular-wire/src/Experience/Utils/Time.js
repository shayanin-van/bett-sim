import EventEmitter from "./EventEmitter.js";

export default class Time extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.start = Date.now() / 1000;
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16 / 1000;

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    const currentTime = Date.now() / 1000;
    this.delta = currentTime - this.current;

    // fix for browser tab switching
    if (this.delta > 1 / 30) {
      this.delta = 1 / 30;
    }

    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.trigger("tick");

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
