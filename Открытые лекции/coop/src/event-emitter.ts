export type Event = "data" | "error";

export type DataResult<D = unknown, R = unknown> = {done: false; value: D} | {done: true; value: R};

export type ErrorResult<E = unknown> = {done: true; error: E; value: undefined};

export type DataHandler<D, R> = (data: DataResult<D, R>) => void;

export type ErrorHandler<E> = (err: ErrorResult<E>) => void;

export class EventEmitter<D = unknown, R = unknown, E = unknown> {
  #handlers = {
    data: new Set<DataHandler<D, R>>(),
    error: new Set<ErrorHandler<E>>()
  };

  #done = false;
  #promise: PromiseWithResolvers<DataResult<D, R>> | null = null;

  [Symbol.asyncIterator]() {
    return {
      [Symbol.asyncIterator]() {
        return this;
      },

      next: ()=> {
        if (this.#promise != null) {
          return this.#promise.promise;
        }

        if (this.#done) {
          return Promise.resolve({done: true, value: undefined});
        }

        this.#promise = Promise.withResolvers();

        const cleanup = () => {
          this.off("data", onData);
          this.off("error", onError);
        };

        const onData = (data: DataResult<D, R>) => {
          cleanup();

          const promise = this.#promise!;
          this.#promise = null;

          promise.resolve(data);
        };

        const onError = (err: ErrorResult<E>) => {
          cleanup();

          const promise = this.#promise!;
          this.#promise = null;

          promise.reject(err);
        };

        this.on("data", onData);
        this.on("error", onError);

        return this.#promise.promise;
      }
    };
  }

  on(event: "data", handler: DataHandler<D, R>): void;
  on(event: "error", handler: ErrorHandler<E>): void;
  on(event: Event, handler: DataHandler<D, R> | ErrorHandler<E>) {
    this.#getStore(event).add(handler);
  }

  off(event?: Event, handler?: Function) {
    if (event == null) {
      this.off("data", handler);
      this.off("error", handler);
      return;
    }

    const store = this.#getStore(event);

    if (handler == null) {
      store.clear();

    } else {
      store.delete(handler);
    }
  }

  emit(event: "data", data: DataResult<D, R>): void;
  emit(event: "error", error: E): void;

  emit(event: Event, payload: DataResult<D, R> | E) {
    this.#getStore(event).forEach((handler) => {
      handler(payload);
    });
  }

  #getStore(event: Event): Set<Function> {
    return event === "data" ? this.#handlers.data : this.#handlers.error;
  }
}
