'use strict';

const Pages = require('./handlers/pages');
const Work = require('./handlers/work');

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
},{
  method: 'POST',
  path: '/randomarray',
  handler: Work.randomArray,
},{
  method: 'POST',
  path: '/fibonaccirecursive',
  handler: Work.fibonacciRecursive,
}];
