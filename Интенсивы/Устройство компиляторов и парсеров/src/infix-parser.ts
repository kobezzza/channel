function parseInfixExpr(str) {
	str = str.replace(/\s/g, '');

	if (/[^\d()+\-*/]/.test(str) || /(^|[^\d(])[+\-*/]($|[^\d)])/.test(str)) {
		return NaN;
	}

	const
		stack: string[] = [],
		queue: Array<string | number> = [];

	const
		isOp = /[+\-*/]/;

	const priority = {
		'(': -1,
		')': -1,
		'+': 0,
		'-': 0,
		'*': 2,
		'/': 1
	};

	for (const char of str) {
		if (char === '(') {
			stack.push(char);

		} else if (char === ')') {
			let
				valid = false;

			while (stack.length > 0) {
				const
					head = stack.pop();

				if (head === '(') {
					valid = true;
					break;
				}

				queue.push(head!);
			}

			if (!valid) {
				return NaN;
			}

		} else if (isOp.test(char)) {
			if (stack.length === 0 || stack.at(-1) === '(') {
				stack.push(char);

			} else {
				while (priority[stack.at(-1)!] > priority[char]) {
					queue.push(stack.pop()!);
				}

				stack.push(char);
			}

		} else {
			queue.push(parseInt(char));
		}
	}

	while (stack.length > 0) {
		queue.push(stack.pop()!);
	}

	const
		exprStack: number[] = [];

	for (const val of queue) {
		if (typeof val === 'number') {
			exprStack.push(val);

		} else {
			switch (val) {
				case '(': return NaN;
				case ')': return NaN;

				case '+':
					exprStack.push(exprStack.pop()! + exprStack.pop()!);
					break;

				case '-': {
					const
						b = exprStack.pop()!,
						a = exprStack.pop()!;

					exprStack.push(a - b);
					break;
				}

				case '*':
					exprStack.push(exprStack.pop()! * exprStack.pop()!);
					break;

				case '/': {
					const
						b = exprStack.pop()!,
						a = exprStack.pop()!;

					exprStack.push(a / b);
					break;
				}
			}
		}
	}

	return exprStack.pop();
}

console.log(parseInfixExpr('1 + 2 * 7 / 2 - 5'));
console.log(parseInfixExpr('(1 + 2) * 7 / 2 - 5'));
console.log(parseInfixExpr('((1 + 2) * 7'));
