'use strict';

const Joi = require('joi');
const Hapi = require('hapi');
const Path = require('path');
const Pages = require('./handlers/pages');
const channel = require('./rabbitmq_connection.js');
const generateUuid = function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString() 
};

const server = Hapi.server({
  port: 4000,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: Path.join(__dirname, 'public')
    }
  }
});


const init = async () => {

  await server.register(require('vision'));
  await server.register(require('inert'));
  await server.register(require('nes'));

  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views',
    layoutPath: './views/layout',
    layout: true

  });

  await server.register({
    plugin: require('good'),
    options: {
      reporters: {
        myConsoleReporter: [{
          module: 'good-console',
        }, 'stdout']
      }
    }
  });


  server.route(require('./routes'));
  server.route({
    method: 'POST',
    path: '/socket/create',
    handler: (request, h) => {
      // server.publish('/socket', { "randomNonWorker": Math.random() });
      
      // asynchronously publish it after worker sends back a response
      
      console.log(request.payload.n);
      channel.then((ch) => {
        // client sending to mq queue
        // with unique corrId
        ch.assertQueue('', {exclusive: true}, function (err, q) {

          let corr = generateUuid();
          console.log(` [POST] ${request.payload.n}`);

          const command = { command:'returnN', n: request.payload.n };

          // is this blocking? is this the right way to architect it?
          ch.consume(q.queue, function(msg) {
            if (msg.properties.correlationId == corr) {
              console.log(` [.] Got ${msg.content.toString()}`);
              server.publish('/socket', { "randomWorker": msg.content.toString() });
            }
          }, {noAck: true});

          ch.sendToQueue('rpc_queue', new Buffer(JSON.stringify(command)), {
            correlationId: corr, replyTo: q.queue
          });
        })
      })
      
      return h.response('OK').code(200);
    },
  })
  server.route({
    method: 'GET',
    path: '/socket',
    handler: Pages.socket,
  })

  server.subscription('/socket');
  await server.start();
  
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();
