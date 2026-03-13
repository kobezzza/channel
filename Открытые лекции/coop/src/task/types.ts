import type {Scheduler} from "#scheduler.ts";
import type {EventEmitter, DataHandler, ErrorHandler} from "#event-emitter.ts";

export interface TaskHelper {
  shouldPause(): boolean;
}

export type TaskHelperConstructor = new(scheduler: Scheduler) => TaskHelper;

export type TaskBuilder =
  (scheduler: Scheduler) =>
    <H extends TaskHelperConstructor>(TaskHelper: H) =>
      <F extends (taskHelper: InstanceType<H>, ...args: any) => IterableIterator<any>>(fn: F) =>
        (...args: ts.Pop<Parameters<F>>) => any extends (...args: any) => IterableIterator<infer D, infer R> ?
          EventablePromise<Promise<R>, D> :
          EventablePromise<Promise<unknown>>;

interface AsyncIterable<T, TReturn = any, TNext = any> {
  [Symbol.asyncIterator](): AsyncIterableIterator<T, TReturn, TNext>;
}

export type EventablePromise<P extends Promise<any>, D = Awaited<P>> = Omit<P, "catch"> & {
  on(event: "data", handler: DataHandler<D, Awaited<P>>): P;
  on(event: "error", handler: ErrorHandler<any>): P;
  off(...args: Parameters<EventEmitter<any, any>["off"]>): P;
  catch<T = never>(onrejected?: ((reason: any) => T | PromiseLike<T>) | undefined | null): EventablePromise<Promise<Awaited<P> | T>>;
} & AsyncIterable<D, Awaited<P>>;
