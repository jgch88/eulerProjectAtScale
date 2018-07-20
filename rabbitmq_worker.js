const amqp = require('amqplib/callback_api');

const randomArray = function randomArray(n) {
  // must validate n is positive
  const arr = Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = Math.random();
  }
  return arr;
};

const fibonacciRecursive = function fibonacciRecursive(n) {
  // must validate n is positive
  if (n == 0 || n == 1) {
    return n;
  } else {
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
  }
};

amqp.connect('amqp://localhost', function(err,conn) {
  conn.createChannel(function(err, ch) {
    const q = 'rpc_queue';

    ch.assertQueue(q, {durable:false});
    ch.prefetch(1);
    console.log(`[x] Awaiting RPC requests`);

    ch.consume(q, function reply(msg) {
      // need some kind of abstraction for message structure
      // so that we dont use if else statements
      // In Enterprise Integration Patterns under Chapter 5 Message Construction
      // Use Command pattern
      
      // buffer is always in string?
      console.log(msg.content.toString());
      const message = JSON.parse(msg.content.toString());
      console.log(message);
      let ans = '';
      if (message.command === 'randomArray') {
        ans = randomArray(message.n);
        console.log(ans);
      }

      if (message.command === 'fibonacciRecursive') {
        ans = fibonacciRecursive(message.n);
        console.log(ans);
      }

      if (message.command === 'returnN') {
        ans = message.n;
        console.log(`return ${ans}`);
      }
      // something that the 202 can deal with later...
      ch.sendToQueue(msg.properties.replyTo,
        new Buffer(ans.toString()),
        {correlationId: msg.properties.correlationId}
      );
      
      ch.ack(msg);

    })
  })
})
