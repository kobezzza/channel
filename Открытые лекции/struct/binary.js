import { writeFileSync, readFileSync } from 'node:fs';

import { PersonArray } from './scheme.js';
import { personArray } from './data.js';

writeFileSync('./data.binary', Buffer.from(personArray.buffer), {encoding: 'binary'});

const buf = readFileSync('./data.binary').buffer;

console.time('parsing');

console.log(PersonArray.from(buf).get(0).id);
console.log(PersonArray.from(buf).get(1).id);

console.timeEnd('parsing');
