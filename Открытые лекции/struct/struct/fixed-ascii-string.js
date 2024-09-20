export const FixedAsciiString = (maxLength) => {
	return {
		get byteLength() {
			return maxLength;
		},

		init(buffer, offset) {
			const arr = new Uint8Array(buffer, offset);

			return {
				get() {
					let str = '';

					for (const charCode of arr) {
						if (charCode === 0) {
							break;
						}

						str += String.fromCharCode(charCode);
					}

					return str;
				},

				set(str) {
					for (let i = 0; i < maxLength; i++) {
						arr[i] = i >= str.length ? 0 : str.charCodeAt(i);
					}
				}
			};
		}
	};
}
