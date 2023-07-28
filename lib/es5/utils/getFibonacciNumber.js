"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFibonacciNumber = void 0;
var getFibonacciNumber = function (n) {
    return n <= 1 ? n : (0, exports.getFibonacciNumber)(n - 1) + (0, exports.getFibonacciNumber)(n - 2);
};
exports.getFibonacciNumber = getFibonacciNumber;
