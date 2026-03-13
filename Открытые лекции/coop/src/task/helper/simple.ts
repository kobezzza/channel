import type {Scheduler} from "#scheduler.ts";
import type {TaskHelper} from "#task/types.ts";

export class SimpleTaskHelper implements TaskHelper {
  protected time = 0;

  protected scheduler: Scheduler;

  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler;
  }

  shouldPause() {
    this.time ||= performance.now();

    if (performance.now() - this.time > this.scheduler.quota / 4) {
      this.time = 0;
      return true;
    }

    return false;
  }
}
