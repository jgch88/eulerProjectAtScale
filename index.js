'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
  port: 4000,
  host: 'localhost',
});

server.route(require('./routes'));

const init = async () => {

  await server.register(require('vision'));

  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views',

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
  })

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();
