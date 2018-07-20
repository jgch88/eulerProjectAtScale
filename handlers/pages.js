'use strict';

exports.home = (request, h) => {

  return h.view('index');
};

exports.socket = (request, h) => {

  return h.view('socket');
}
