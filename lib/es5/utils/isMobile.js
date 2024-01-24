"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMobile = void 0;
var isMobile = function () {
    return typeof global !== 'undefined' && global.navigator && global.navigator.product === 'ReactNative';
};
exports.isMobile = isMobile;
