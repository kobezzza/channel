import { parentPort } from 'node:worker_threads';

import { PersonArray } from './scheme.js';

parentPort.on('message', ({type, data, time}) => {
	if (type === 'DATA') {
		console.log('start', Date.now() - time);
		console.log(PersonArray.from(data).get(0).firstName);
		console.log('end', Date.now() - time);
	}
});
