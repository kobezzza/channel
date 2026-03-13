import type {Scheduler, SchedulerOptions, JobResult} from "./types.ts";

export class RoundRobinScheduler implements Scheduler {
  #running = false;

  readonly #queue: Function[] = [];

  readonly #quota: number;
  readonly #delay: number;

  get quota() {
    return this.#quota;
  }

  get delay() {
    return this.#delay;
  }

  constructor(opts: SchedulerOptions) {
    this.#quota = opts.quota;
    this.#delay = opts.delay;
  }

  isRunning() {
    return this.#running;
  }

  clear() {
    this.#running = false;
    this.#queue.splice(0, this.#queue.length);
  }

  push(job: IterableIterator<unknown>, handler: (result: JobResult) => void) {
    const worker = () => {
      try {
        const result = job.next() as JobResult;

        if (!result.done) {
          this.#queue.push(worker);
        }

        handler(result);

      } catch (error) {
        handler({done: true, error, value: undefined});
      }
    };

    this.#queue.push(worker);
    this.run();

    return this.#queue.length;
  }

  run() {
    if (this.#running) {
      return;
    }

    this.#running = true;

    let now = 0;

    const run = () => {
      if (!this.#running) {
        return;
      }

      const job = this.#queue.shift();

      if (job == null) {
        this.#running = false;
        return;
      }

      now ||= performance.now();
      job();

      if (performance.now() - now >= this.#quota) {
        now = 0;
        setTimeout(run, this.#delay);

      } else {
        run();
      }
    };

    queueMicrotask(run);
  }
}
