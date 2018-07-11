'use strict';

const randomArray = function randomArray(n) {
  // must validate n is positive
  const arr = Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = Math.random();
  }
  return arr;
};

exports.randomArray = (request, h) => {

  return new Promise(resolve => {
    let result = randomArray(request.payload.n);
    const response = h.response({ result });
    resolve(response);
  });
};

const fibonacciRecursive = function fibonacciRecursive(n) {
  // must validate n is positive
  if (n == 0 || n == 1) {
    return 1;
  } else {
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
  }
};

exports.fibonacciRecursive = (request, h) => {

  return new Promise(resolve => {
    let result = fibonacciRecursive(request.payload.n);
    const response = h.response({ result });
    resolve(response);
  });
};
