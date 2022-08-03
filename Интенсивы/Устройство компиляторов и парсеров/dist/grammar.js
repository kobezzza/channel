"use strict";
// алфавит
// слова (строки)
// грамматика
console.dir(parse('(123)'), { depth: null });
function parse(str) {
    const tokens = [];
    program(str, tokens);
    return tokens;
}
function program(str, tokens) {
    if (str === '') {
        return '';
    }
    return expr0(str, tokens);
}
function expr0(str, tokens) {
    const subTokens = [], newStr = expr1(str, subTokens), laSymbol = newStr[0];
    if (laSymbol === '+' || laSymbol === '-') {
        const res = expr0(newStr.slice(1), subTokens);
        tokens.push({
            type: laSymbol,
            value: subTokens
        });
        return res;
    }
    tokens.push(...subTokens);
    return newStr;
}
function expr1(str, tokens) {
    const subTokens = [], newStr = expr2(str, subTokens);
    if (newStr[0] === '/') {
        const res = expr1(newStr.slice(1), subTokens);
        tokens.push({
            type: '/',
            value: subTokens
        });
        return res;
    }
    tokens.push(...subTokens);
    return newStr;
}
function expr2(str, tokens) {
    const subTokens = [], newStr = expr3(str, subTokens);
    if (newStr[0] === '*') {
        const res = expr2(newStr.slice(1), subTokens);
        tokens.push({
            type: '*',
            value: subTokens
        });
        return res;
    }
    tokens.push(...subTokens);
    return newStr;
}
function expr3(str, tokens) {
    if (str[0] === '(') {
        const subTokens = [];
        let newStr = expr0(str.slice(1), subTokens);
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
function num(str, tokens = []) {
    const literal = /^-?\d+/.exec(str);
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
