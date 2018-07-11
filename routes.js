'use strict';

const Pages = require('./handlers/pages');

module.exports = [{
  method: 'GET',
  path: '/',
  handler: Pages.home,
},{
  method: 'GET',
  path: '/json',
  handler: (request, h) => {

    return { hello: 'World' };
  }
},{
  method: 'GET',
  path: '/{name}',
  handler: (request, h) => {

    return h.view(`${request.params.name}`);
  },
}];
