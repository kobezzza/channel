export class Vector {
	get length() {
		return this.#length;
	}

	get buffer() {
		return this.#arr.buffer;
	}

	get byteLength() {
		return this.#arr.byteLength;
	}

	get BYTES_PER_ELEMENT() {
		return this.#arr.BYTES_PER_ELEMENT;
	}

	#constr;
	#arr;

	#capacity;
	#length = 0;

	constructor(constr, capacity) {
		this.#constr = constr;
		this.#capacity = capacity;
		this.#arr = constr(capacity);
	}

	get(index) {
		if (index > this.length) {
			throw new RangeError('UB');
		}

		return this.#arr.get(index);
	}

	set(index, value) {
		if (index > this.length) {
			throw new RangeError('UB');
		}

		return this.#arr.set(index, value);
	}

	push(value) {
		if (this.#length >= this.#capacity) {
			this.#capacity *= 2;

			const newArray = this.#constr(this.#capacity);
			new Uint8Array(newArray.buffer).set(new Uint8Array(this.#arr.buffer));

			this.#arr = newArray;
		}

		this.#arr.set(this.#length++, value);
		return this.length;
	}

	pop() {
		if (this.length === 0) {
			return undefined;
		}

		return this.#arr.get(this.#length--);
	}

	shrinkToFeet() {
		if (this.length !== this.#capacity) {
			this.#capacity = this.length;

			const newArray = this.#constr(this.#capacity);
			new Uint8Array(newArray.buffer).set(new Uint8Array(this.#arr.buffer).subarray(0, this.length));

			this.#arr = newArray;
		}
	}
}
