import type {DataResult, ErrorResult} from "#event-emitter.ts";

export type JobResult = DataResult | ErrorResult;

export interface SchedulerOptions {
  quota: number;
  delay: number;
}

export interface Scheduler {
  get quota(): number;
  get delay(): number;
  isRunning(): boolean;
  push(job: IterableIterator<unknown>, handler: (result: JobResult) => void): number;
  clear(): void;
  run(): void;
}
