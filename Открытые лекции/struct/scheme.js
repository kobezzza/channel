import { Struct, Tuple, TypedArray, U8, U16, FixedAsciiString } from './struct/index.js'

export const Color = Tuple(U8, U8, U8);

export const Person = new Struct({
	age: U8,
	id: U16,
	firstName: FixedAsciiString(8),
	lastName: FixedAsciiString(8),
	color: Color
});

export const PersonArray = new TypedArray(Person, 1e6);
