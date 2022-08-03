"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iter_1 = require("./iter");
var ParserState;
(function (ParserState) {
    ParserState[ParserState["EXPECT_NEW_INPUT"] = 0] = "EXPECT_NEW_INPUT";
})(ParserState || (ParserState = {}));
class ParserError extends Error {
    prev;
    constructor(message, prev) {
        super(message);
        this.prev = prev;
    }
}
function testChar(test, char, prev) {
    switch (typeof test) {
        case 'string':
            if (test !== char) {
                throw new ParserError('Invalid string', prev);
            }
            break;
        case 'function':
            if (!test(char)) {
                throw new ParserError('Invalid string', prev);
            }
            break;
        default:
            if (!test.test(char)) {
                throw new ParserError('Invalid string', prev);
            }
    }
    return true;
}
function tag(pattern, opts = {}) {
    return function* (source, prev) {
        let iter = (0, iter_1.intoIter)(source);
        let value = '';
        for (const test of pattern) {
            let chunk = iter.next(), char = chunk.value;
            if (chunk.done) {
                const data = yield ParserState.EXPECT_NEW_INPUT;
                if (data == null) {
                    throw new ParserError('Invalid input', prev);
                }
                iter = (0, iter_1.intoIter)(data);
                chunk = iter.next();
                char = chunk.value;
            }
            testChar(test, char, prev);
            value += char;
        }
        if (opts.token) {
            yield {
                type: opts.token,
                value: opts.tokenValue?.(value) ?? value
            };
        }
        const token = {
            type: 'TAG',
            value,
        };
        return [token, iter];
    };
}
function take(test, opts = {}) {
    return function* (source, prev) {
        const { min = 1, max = Infinity } = opts;
        const buffer = [];
        let iter = (0, iter_1.intoIter)(source), count = 0;
        let value = '';
        while (true) {
            if (count >= max) {
                break;
            }
            let chunk = iter.next(), char = chunk.value;
            if (chunk.done) {
                if (count >= min) {
                    break;
                }
                const data = yield ParserState.EXPECT_NEW_INPUT;
                if (data == null) {
                    throw new ParserError('Invalid input', prev);
                }
                source = data;
                iter = (0, iter_1.intoIter)(source);
                chunk = iter.next();
                char = chunk.value;
            }
            try {
                if (testChar(test, char, prev)) {
                    count++;
                }
            }
            catch (err) {
                if (count < min) {
                    throw err;
                }
                buffer.push(char);
                break;
            }
            value += char;
        }
        if (opts.token && count > 0) {
            yield {
                type: opts.token,
                value: opts.tokenValue?.(value) ?? value
            };
        }
        const token = {
            type: 'TAKE',
            value,
        };
        return [token, buffer.length > 0 ? (0, iter_1.seq)(buffer, iter) : iter];
    };
}
function seq(optsOrParser, ...parsers) {
    let opts = {};
    if (typeof optsOrParser === 'function') {
        parsers.unshift(optsOrParser);
    }
    else {
        opts = optsOrParser;
    }
    return function* (source, prev) {
        const value = [];
        let iter = (0, iter_1.intoIter)(source), data;
        for (const parser of parsers) {
            const parsing = parser(iter, prev);
            while (true) {
                const chunk = parsing.next(data);
                if (chunk.done) {
                    prev = chunk.value[0];
                    value.push(prev);
                    iter = (0, iter_1.intoIter)(chunk.value[1]);
                    break;
                }
                else {
                    if (chunk.value === ParserState.EXPECT_NEW_INPUT) {
                        data = yield chunk.value;
                    }
                    else {
                        yield chunk.value;
                    }
                }
            }
        }
        if (opts.token) {
            yield {
                type: opts.token,
                value: opts.tokenValue?.(value) ?? value
            };
        }
        const token = {
            type: 'SEQ',
            value
        };
        return [token, iter];
    };
}
function or(optsOrParser, ...parsers) {
    let opts = {};
    if (typeof optsOrParser === 'function') {
        parsers.unshift(optsOrParser);
    }
    else {
        opts = optsOrParser;
    }
    return function* (source, prev) {
        const yields = [];
        let value, done = false, iter = (0, iter_1.intoIter)(source), data;
        outer: for (const parser of parsers) {
            const buffer = [], parsing = parser((0, iter_1.intoBufIter)(iter, buffer), prev);
            while (true) {
                try {
                    const chunk = parsing.next(data);
                    if (chunk.done) {
                        done = true;
                        value = chunk.value[0];
                        iter = (0, iter_1.intoIter)(chunk.value[1]);
                        break outer;
                    }
                    else {
                        if (chunk.value === ParserState.EXPECT_NEW_INPUT) {
                            data = yield chunk.value;
                        }
                        else {
                            yields.push(chunk.value);
                        }
                    }
                }
                catch (err) {
                    iter = buffer.length > 0 ? (0, iter_1.seq)(buffer, iter) : iter;
                    yields.splice(0, yields.length);
                    break;
                }
            }
        }
        if (!done) {
            throw new ParserError('Invalid data', prev);
        }
        yield* yields;
        if (opts.token) {
            yield {
                type: opts.token,
                value: opts.tokenValue?.(value) ?? value
            };
        }
        const token = {
            type: 'OR',
            value
        };
        return [token, iter];
    };
}
function repeat(parser, opts = {}) {
    return function* (source, prev) {
        const { min = 1, max = Infinity } = opts;
        const value = [], yields = [];
        let iter = (0, iter_1.intoIter)(source), count = 0, data;
        const globalBuffer = [];
        outer: while (true) {
            const buffer = count >= min ? [] : globalBuffer, parsing = parser((0, iter_1.intoBufIter)(iter, buffer), prev);
            while (true) {
                if (count >= max) {
                    yield* yields;
                    break outer;
                }
                try {
                    const chunk = parsing.next(data);
                    if (chunk.done) {
                        prev = chunk.value[0];
                        iter = (0, iter_1.intoIter)(chunk.value[1]);
                        value.push(prev);
                        count++;
                        if (count >= min) {
                            yield* yields;
                            yields.splice(0, yields.length);
                        }
                        break;
                    }
                    else {
                        if (chunk.value === ParserState.EXPECT_NEW_INPUT) {
                            data = yield chunk.value;
                            if (data == null) {
                                throw new ParserError('Invalid input', prev);
                            }
                            iter = (0, iter_1.intoIter)(data);
                        }
                        else {
                            yields.push(chunk.value);
                        }
                    }
                }
                catch (err) {
                    if (count < min) {
                        throw err;
                    }
                    iter = buffer.length > 0 ? (0, iter_1.seq)(buffer, iter) : iter;
                    break outer;
                }
            }
        }
        if (opts.token && count > 0) {
            yield {
                type: opts.token,
                value: opts.tokenValue?.(value) ?? value
            };
        }
        const token = {
            type: 'REPEAT',
            value
        };
        return [token, iter];
    };
}
function opt(parser, opts) {
    return repeat(parser, { min: 0, max: 1, ...opts });
}
const ws = take(/\s/, { min: 0 });
const sign = take(/[\-+]/, {
    min: 0,
    max: 1,
    token: 'NUMBER_SIGN'
});
const exp = seq(tag([/e/i]), take(/[\-+]/, { token: 'EXP_SIGN', min: 0, max: 1 }), take(/\d/, { token: 'EXP_VALUE' }));
const fractional = seq(tag('.'), take(/\d/, { token: 'FRACTIONAL_VALUE' }));
const number = seq(sign, seq(or(seq(tag('0', { token: 'INT_VALUE' }), fractional), seq(seq({
    token: 'INT_VALUE',
    tokenValue(value) {
        return value.reduce((res, { value }) => res + value, '');
    }
}, tag([/[1-9]/]), take(/\d/, { min: 0 })), opt(fractional))), opt(exp)));
const string = seq({
    token: 'STRING_VALUE',
    tokenValue(value) {
        return value.reduce((res, { value }) => res + value, '');
    }
}, tag('"'), take(/[^"]/), tag('"'));
const boolean = or({
    token: 'BOOLEAN_VALUE',
    tokenValue({ value }) {
        return value;
    }
}, tag('true'), tag('false'));
const json = (source, prev) => or(string, boolean, number, array, object)(source, prev);
const array = seq(tag('[', { token: 'ARRAY_START' }), ws, repeat(seq(ws, json, ws, tag(','), ws), { min: 0 }), opt(json), ws, tag(']', { token: 'ARRAY_END' }));
const objectKey = seq({
    token: 'OBJECT_KEY',
    tokenValue(value) {
        return value[1].value;
    }
}, tag('"'), take(/[^"]/), tag('"'), ws, tag(':'), ws);
const objectValue = seq(ws, objectKey, ws, json, ws);
const object = seq(tag('{', { token: 'OBJECT_START' }), ws, repeat(seq(ws, objectValue, ws, tag(','), ws), { min: 0 }), opt(objectValue), ws, tag('}', { token: 'OBJECT_END' }));
const p = json('{"a" : {"b": [1, 2, 3]}}');
console.dir([...p], { depth: null });
