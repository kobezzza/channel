import type {TaskBuilder, EventablePromise} from "./task/types.ts";

import {EventEmitter} from "./event-emitter.ts";

export * from "./task/types.ts";
export {SimpleTaskHelper} from "./task/helper/simple.ts";

export const taskBuilder: TaskBuilder =
  (scheduler) =>
    (TaskHelper) =>
      (job) =>
        (...args) => {
          const emitter = new EventEmitter();

          const taskHelper = new TaskHelper(scheduler) as InstanceType<typeof TaskHelper>;

          return addEmitter(new Promise((resolve, reject) => {
            scheduler.push(job(taskHelper, ...args), (result) => {
              if ("error" in result) {
                emitter.emit("error", result);
                reject(result);

              } else {
                emitter.emit("data", result);

                if (result.done) {
                  resolve(result.value);
                }
              }
            });
          }));

          function addEmitter(promise: Promise<unknown>): EventablePromise<Promise<any>> {
            const eventablePromise = promise as ReturnType<typeof addEmitter>;

            const originalCatch = promise.catch;

            void Object.defineProperty(eventablePromise, "catch", {
              value: (...args: Parameters<Promise<any>["catch"]>) => {
                return addEmitter(originalCatch.apply(promise, args));
              }
            });

            void Object.defineProperty(eventablePromise, "on", {
              configurable: true,
              writable: true,
              value: (...args: Parameters<EventEmitter["on"]>) => {
                emitter.on(...args);
                return eventablePromise;
              }
            });

            void Object.defineProperty(eventablePromise, "off", {
              configurable: true,
              writable: true,
              value: (...args: Parameters<EventEmitter["off"]>) => {
                emitter.off(...args);
                return eventablePromise;
              }
            });

            void Object.defineProperty(eventablePromise, Symbol.asyncIterator, {
              configurable: true,
              writable: true,
              value: () => emitter[Symbol.asyncIterator]()
            });

            return eventablePromise;
          }
        };
