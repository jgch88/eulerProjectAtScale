const Assert = require('assert');
const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const test = lab.test;

lab.test('addition should add two numbers together', () => {

  Assert(1 + 1 === 2);
});
