const amqp = require('amqplib/callback_api');

// return a promise that's a connection?
module.exports = new Promise((resolve, reject) => {
  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
      resolve(ch);
    })
  })
});
