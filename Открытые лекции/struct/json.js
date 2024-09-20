import { writeFileSync, readFileSync } from 'node:fs';

const data = Array.from({length: 1e5}, () => ({
	age: getRandomInt(1, 99),
	id: getRandomInt(1, 1000),
	firstName: generateRandomString(8),
	lastName: generateRandomString(8),
	color: [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]
}));

writeFileSync('./data.json', JSON.stringify(data));

const buf = readFileSync('./data.json');

console.time('parsing');

console.log(JSON.parse(buf.toString())[0].color);

console.timeEnd('parsing');

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomString(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	let result = '';
	const charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
}
