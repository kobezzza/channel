export const U16 = {
	get byteLength() {
		return 2;
	},

	get alignment() {
		return 2;
	},

	init(buffer, offset) {
		const remainder = offset % U16.alignment;
		offset = remainder === 0 ? offset : offset - remainder;

		const arr = new Uint16Array(buffer, offset, 1);

		return {
			get() {
				return arr[0];
			},

			set(value) {
				arr[0] = value;
			}
		};
	}
};
