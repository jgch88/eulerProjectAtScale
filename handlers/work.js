'use strict';

const channel = require('../rabbitmq_connection.js');
const generateUuid = function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString() 
};

const randomArray = function randomArray(n) {
  // must validate n is positive
  const arr = Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = Math.random();
  }
  return arr;
};

exports.randomArray = (request, h) => 
{
  channel.then((ch) => {
    ch.assertQueue('', {exclusive: true}, function (err, q) {
      let corr = generateUuid();
      console.log(` [POST] randomArray ${request.payload.n}`);
      
      const command = { command: 'randomArray', n: request.payload.n };
      // ch.sendToQueue('rpc_queue', new Buffer(request.payload.n.toString()), { correlationId: corr, replyTo: q.queue})
      ch.sendToQueue('rpc_queue', new Buffer(JSON.stringify(command)), { correlationId: corr, replyTo: q.queue})

    })

  })
  return h.response(request.payload.n).code(202);
  
  /*
  return new Promise(resolve => {
    let result = randomArray(request.payload.n);
    const response = h.response({ result });
    resolve(response);
  });
  */
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

  channel.then((ch) => {
    ch.assertQueue('', {exclusive: true}, function (err, q) {
      let corr = generateUuid();
      console.log(` [POST] fibonacciRecursive ${request.payload.n}`);
      
      const command = { command: 'fibonacciRecursive', n: request.payload.n };
      // ch.sendToQueue('rpc_queue', new Buffer(request.payload.n.toString()), { correlationId: corr, replyTo: q.queue})
      ch.sendToQueue('rpc_queue', new Buffer(JSON.stringify(command)), { correlationId: corr, replyTo: q.queue})

    })

  })
  return h.response(request.payload.n).code(202);
  /*
  return new Promise(resolve => {
    let result = fibonacciRecursive(request.payload.n);
    const response = h.response({ result });
    resolve(response);
  });
  */
};
