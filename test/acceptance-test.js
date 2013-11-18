var net = require('net');
var url = require('url');
var assert = require('assert');
var request = require('superagent');
var nock = require('nock');
var should = require('should');

require('../')(request);

describe('acceptance - superagent.Request#proxy()', function () {
  it('should make a request to the http endpoint', function (done) {
    request.get('http://yahoo.co.uk').proxy('http://localhost:3128').end(function (res) {
      should.exist(res)
      // res.body.ip.should.exist
      done()
    })
  });

  it('should make a request to the https endpoint', function (done) {
    this.timeout(0);
    request.get('https://yahoo.com').proxy('http://localhost:3128').end(function (res) {
      should.exist(res);
      done()
    })
  })
})