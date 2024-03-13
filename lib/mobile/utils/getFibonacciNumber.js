export const getFibonacciNumber = (n) => {
    return n <= 1 ? n : getFibonacciNumber(n - 1) + getFibonacciNumber(n - 2);
};
