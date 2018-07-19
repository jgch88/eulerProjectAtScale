'use strict';
const Joi = require('joi');
const Pages = require('./handlers/pages');
const Work = require('./handlers/work');
const Assets = require('./handlers/assets');
const ch = require('./rabbitmq_connection.js');
const Hapi = require('hapi');

const server = Hapi.server();

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
  path: '/1/{name}',
  handler: (request, h) => {

    return h.view(`${request.params.name}`);
  },
},{
  method: 'GET',
  path: '/{filename}',
  handler: {
    file: function (request) {
      return request.params.filename;
    }
  }
},{
  method: 'POST',
  path: '/randomarray',
  handler: Work.randomArray,
  options: {
    validate: {
      payload: {
        n: Joi.number().min(0).integer(),
      }
    }
  }
},{
  method: 'POST',
  path: '/fibonaccirecursive',
  handler: Work.fibonacciRecursive,
  options: {
    validate: {
      payload: {
        n: Joi.number().min(0).integer(),
      }
    }
  }
}];
