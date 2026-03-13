import {taskBuilder, SimpleTaskHelper} from "#task.ts";
import {RoundRobinScheduler} from "#scheduler.ts";

const task = taskBuilder(new RoundRobinScheduler({quota: 300, delay: 50}))(SimpleTaskHelper);

const exec = task(function* doSomething(t, n: number) {
  let data = [];

  for (let i = 0; i < n; i++) {
    data.push(i);

    if (t.shouldPause()) {
      yield data;
      data = [];
    }
  }

  if (data.length > 0) {
    yield data;
  }

  return "done";
});

// setInterval(() => {
//   console.log("ha");
// }, 10);

(async () => {
  try {
    for await (const data of exec(10000000).catch(console.error)) {
      console.log(data);
    }
  } catch (e) {
    console.log(1111, e);
  }
})();

