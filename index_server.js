'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Pages = require('./handlers/pages');

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
      server.publish('/socket', { id: Math.random() });
      return h.response('OK').code(200);
    }
  })
  server.route({
    method: 'GET',
    path: '/socket',
    handler: Pages.home,
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
