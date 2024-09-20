import { Person } from './scheme.js'
import { TypedArray, Vector } from './struct/index.js'

const vec = new Vector(
	(cap) => new TypedArray(Person, cap).create([]),
	2
);

console.log(vec.byteLength);

vec.push(Person.create({
	age: 42,
	id: 531,
	firstName: 'Bob',
	lastName: 'Elton',
	color: [0xFF, 0x00, 0x00]
}));

vec.push(Person.create({
	age: 42,
	id: 531,
	firstName: 'Bob',
	lastName: 'Elton',
	color: [0xFF, 0x00, 0x00]
}));

vec.push(Person.create({
	age: 42,
	id: 531,
	firstName: 'Bob',
	lastName: 'Elton',
	color: [0xFF, 0x00, 0x00]
}));

vec.push(Person.create({
	age: 42,
	id: 531,
	firstName: 'Bob',
	lastName: 'Elton',
	color: [0xFF, 0x00, 0x00]
}));

vec.push(Person.create({
	age: 42,
	id: 531,
	firstName: 'Bob',
	lastName: 'Elton',
	color: [0xFF, 0x00, 0x00]
}));

vec.push(Person.create({
	age: 42,
	id: 531,
	firstName: 'Bob',
	lastName: 'Elton',
	color: [0xFF, 0x00, 0x00]
}));

console.log(vec.get(4).firstName);
console.log(vec.byteLength);

