"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intoIterableIter = exports.intoIter = exports.intoBufIter = exports.seq = void 0;
function seq(...iterable) {
    let cursor = 0, iter = intoIter(iterable[cursor]);
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            let chunk = iter.next();
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
    };
}
exports.seq = seq;
function intoBufIter(iterable, buffer) {
    const iter = intoIter(iterable);
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            const chunk = iter.next();
            if (!chunk.done) {
                buffer.push(chunk.value);
            }
            return chunk;
        }
    };
}
exports.intoBufIter = intoBufIter;
function intoIter(iterable) {
    return intoIterableIter(iterable[Symbol.iterator]());
}
exports.intoIter = intoIter;
function intoIterableIter(iter) {
    if (typeof iter[Symbol.iterator] === 'function') {
        return iter;
    }
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            return iter.next();
        }
    };
}
exports.intoIterableIter = intoIterableIter;
