export const isMobile = () => typeof global !== 'undefined' && global.navigator && global.navigator.product === 'ReactNative';
