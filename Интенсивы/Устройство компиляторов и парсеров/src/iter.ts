export function seq<T>(...iterable: Iterable<T>[]): IterableIterator<T> {
	let
		cursor = 0,
		iter = intoIter(iterable[cursor]);

	return {
		[Symbol.iterator]() {
			return this;
		},

		next() {
			let
				chunk = iter.next();

			while (chunk.done) {
				cursor++;

				if (iterable[cursor] == null) {
					return chunk;
				}

				iter = intoIter(iterable[cursor]);
				chunk = iter.next();
			}

			return chunk;
		}
	}
}

export function intoBufIter<T>(
	iterable: Iterable<T>,
	buffer: T[]
): IterableIterator<T> {
	const iter = intoIter(iterable);

	return {
		[Symbol.iterator]() {
			return this;
		},

		next() {
			const
				chunk = iter.next();

			if (!chunk.done) {
				buffer.push(chunk.value);
			}

			return chunk;
		}
	};
}

export function intoIter<T>(iterable: Iterable<T>): IterableIterator<T> {
	return intoIterableIter(iterable[Symbol.iterator]());
}

export function intoIterableIter<T>(iter: Iterator<T>): IterableIterator<T> {
	if (typeof iter[Symbol.iterator] === 'function') {
		return <any>iter;
	}

	return {
		[Symbol.iterator]() {
			return this;
		},

		next() {
			return iter.next();
		}
	}
}
