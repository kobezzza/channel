import { Worker } from 'node:worker_threads';

import { personArray } from './data.js';

const worker = new Worker('./child-thread.js');

worker.postMessage({type: 'DATA', data: personArray.buffer, time: Date.now()}, [personArray.buffer]);

