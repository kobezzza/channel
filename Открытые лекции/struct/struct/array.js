export class TypedArray {
	constructor(type, length) {
		this.byteLength = type.byteLength * length;
		this.length = length;
		this.type = type;
	}

	create(data, buffer = new ArrayBuffer(this.byteLength), offset = 0) {
		const view = new TypedArrayView(this.type, buffer, this.byteLength, offset);

		for (let i = 0; i < this.length && i < data.length; i++) {
			view.set(i, data[i]);
		}

		return view;
	}

	from(buffer = new ArrayBuffer(this.byteLength), offset = 0) {
		return new TypedArrayView(this.type, buffer, this.byteLength, offset);
	}

	init(buffer, offset) {
		let view = this.from(buffer, offset);

		return {
			get: () => view,

			set: (data) => {
				view = this.create(data, buffer, offset);
			}
		};
	}
}

export class TypedArrayView {
	get buffer() {
		return this.#buffer;
	}

	get byteLength() {
		return this.#byteLength;
	}

	get byteOffset() {
		return this.#byteOffset;
	}

	get BYTES_PER_ELEMENT() {
		return this.#type.byteLength;
	}

	#type;
	#buffer;
	#byteLength;
	#byteOffset;

	constructor(type, buffer, byteLength, byteOffset) {
		this.#type = type;
		this.#buffer = buffer;
		this.#byteLength = byteLength;
		this.#byteOffset = byteOffset;
	}

	get(index) {
		return this.#init(index).get();
	}

	set(index, value) {
		this.#init(index).set(value);
	}

	#init(index) {
		return this.#type.init(this.#buffer, this.#byteOffset + this.#type.byteLength * index);
	}
}
