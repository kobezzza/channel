// алфавит
// слова (строки)
// грамматика

// 1 + 5 * 9 / (6 - 8)
// 45 + 5 + 2

// LR(1)

// program = $expr0 | _

// expr0 = $expr1 | $expr1 + $expr0 | $expr1 - $expr0

// expr1 = $expr2 | $expr2 / $expr1

// expr2 = $expr3 | $expr3 * $expr2

// expr3 = $num | ($expr0)

// num = -?\d+

// Иерархия Хомского

// 0 - язык неограниченный
// 1 - контекстно зависимые языки
// 2 - контекстно-свободные языки
// 3 - регулярные языки

interface Token {
	type: string;
	value?: string | Token[];
}

console.dir(parse('(123)'), {depth: null});

function parse(str) {
	const tokens = [];
	program(str, tokens);
	return tokens;
}

function program(str: string, tokens: Token[]): string {
	if (str === '') {
		return '';
	}

	return expr0(str, tokens);
}

function expr0(str: string, tokens: Token[]): string {
	const
		subTokens = [],
		newStr = expr1(str, subTokens),
		laSymbol = newStr[0];

	if (laSymbol === '+' || laSymbol === '-') {
		const
			res = expr0(newStr.slice(1), subTokens);

		tokens.push({
			type: laSymbol,
			value: subTokens
		});

		return res;
	}

	tokens.push(...subTokens);
	return newStr;
}

function expr1(str: string, tokens: Token[]): string {
	const
		subTokens = [],
		newStr = expr2(str, subTokens);

	if (newStr[0] === '/') {
		const
			res = expr1(newStr.slice(1), subTokens);

		tokens.push({
			type: '/',
			value: subTokens
		});

		return res;
	}

	tokens.push(...subTokens);
	return newStr;
}

function expr2(str: string, tokens: Token[]): string {
	const
		subTokens = [],
		newStr = expr3(str, subTokens);

	if (newStr[0] === '*') {
		const
			res = expr2(newStr.slice(1), subTokens);

		tokens.push({
			type: '*',
			value: subTokens
		});

		return res;
	}

	tokens.push(...subTokens);
	return newStr;
}

function expr3(str: string, tokens: Token[]): string {
	if (str[0] === '(') {
		const
			subTokens = [];

		let
			newStr = expr0(str.slice(1), subTokens);

		if (newStr[0] !== ')') {
			throw new SyntaxError('Invalid string');
		}

		newStr = newStr.slice(1);

		tokens.push({
			type: 'GROUP',
			value: subTokens
		});

		return newStr;
	}

	return num(str, tokens);
}

function num(str: string, tokens: Token[] = []): string {
	const
		literal = /^-?\d+/.exec(str);

	if (literal == null) {
		throw new SyntaxError('Invalid string');
	}

	const token = {
		type: 'NUM',
		value: literal[0]
	};

	tokens.push(token);

	return str.slice(token.value.length);
}
