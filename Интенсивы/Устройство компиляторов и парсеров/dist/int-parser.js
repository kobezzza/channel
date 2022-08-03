"use strict";
function parseMyInt(str) {
    if (!/^-?\d+/.test(str)) {
        return NaN;
    }
    const numerics = {};
    for (let i = 0; i < 10; i++) {
        numerics[i] = i;
    }
    const nums = Array.from(str).reverse(), negative = nums.at(-1) === '-';
    if (negative) {
        nums.pop();
    }
    let res = 0;
    for (let i = 0; i < nums.length; i++) {
        res += numerics[nums[i]] * (10 ** i);
    }
    if (negative) {
        res *= -1;
    }
    return res;
}
console.log(parseMyInt('1034'));
console.log(parseMyInt('-54'));
console.log(parseMyInt('3-53'));
