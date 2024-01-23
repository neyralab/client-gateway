export var isMobile = function () {
    return typeof global !== 'undefined' && global.navigator && global.navigator.product === 'ReactNative';
};
