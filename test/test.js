
/**
 * Module dependencies.
 */

var net = require('net');
var url = require('url');
var assert = require('assert');
var request = require('superagent');
var nock = require('nock');
var should = require('should');
// extend with .proxy()
require('../')(request);

describe('superagent-proxy', function () {

  var httpLink = 'http://jsonip.com';
  var httpsLink = 'https://graph.facebook.com';
  var httpResponse = {
    ip: "88.151.154.82",
    about: "/about",
    Pro: "http://getjsonip.com"
  };
  
  var httpsResponse = {
    id: "583807838",
    name: "Nathan Rajlich",
    first_name: "Nathan",
    last_name: "Rajlich",
    link: "http://www.facebook.com/tootallnate",
    username: "tootallnate",
    gender: "male",
    locale: "en_US"
  };

  var httpReq = nock(httpLink).persist().get('/').reply(200,httpResponse,{'Content-Type': 'application/json'});
  var httpsReq = nock(httpsLink).persist().get('/tootallnate').reply(200,httpsResponse,{'Content-Type': 'application/json'});

  describe('superagent.Request#proxy()', function () {
    it('should be a function', function () {
      assert.equal('function', typeof request.Request.prototype.proxy);
    });
    it('should accept a "string" proxy URI', function () {
      var req = request.get('http://foo.com');
      req.proxy('http://example.com');
    });
    it('should accept an options "object" with proxy info', function () {
      var req = request.get('http://foo.com');
      req.proxy({
        protocol: 'https',
        host: 'proxy.org',
        port: 8080
      });
    });
    it('should throw on an options "object" without "protocol"', function () {
      var req = request.get('http://foo.com');
      assert.throws(function () {
        req.proxy({
          host: 'proxy.org',
          port: 8080
        });
      });
    }, /proxy type/);
  });

  describe('http: - HTTP proxy', function () {
    var proxy = process.env.HTTP_PROXY || process.env.http_proxy || 'http://10.1.10.200:3128';

    it('should work against an HTTP endpoint', function (done) {
      request
      .get(httpLink)
      .proxy(proxy)
      .end(function (res) {
        var data = res.body;
        should.exist(data);
        data.should.eql(httpResponse);
        done();
      });
    });

    it('should work against an HTTPS endpoint', function (done) {
      request
      .get(httpsLink+'/tootallnate')
      .proxy(proxy)
      .end(function (res) {
        var data = res.body;
        should.exist(data);
        data.should.eql(httpsResponse);
        done();
      });
    });
  });

  describe('https: - HTTPS proxy', function () {
    var proxy = process.env.HTTPS_PROXY || process.env.https_proxy || 'https://10.1.10.200:3130';

    it('should work against an HTTP endpoint', function (done) {
      var p = url.parse(proxy);
      p.rejectUnauthorized = false;

      request
      .get(httpLink)
      .proxy(p)
      .end(function (res) {
        var data = res.body;
        should.exist(data);
        data.should.eql(httpResponse);
        done();
      });
    });

    it('should work against an HTTPS endpoint', function (done) {
      var p = url.parse(proxy);
      p.rejectUnauthorized = false;

      request
      .get(httpsLink+'/tootallnate')
      .proxy(p)
      .end(function (res) {
        var data = res.body;
        should.exist(data);
        data.should.eql(httpsResponse);
        done();
      });
    });
  });

  describe('socks: - SOCKS proxy', function () {
    var proxy = process.env.SOCKS_PROXY || process.env.socks_proxy || 'socks://127.0.0.1:9050';

    it('should work against an HTTP endpoint', function (done) {
      request
      .get(httpLink)
      .proxy(proxy)
      .end(function (res) {
        var data = res.body;
        should.exist(data);
        data.should.eql(httpResponse);
        done();
      });
    });

    it('should work against an HTTPS endpoint', function (done) {
      request
      .get(httpsLink+'/tootallnate')
      .proxy(proxy)
      .end(function (res) {
        var data = res.body;
        should.exist(data);
        data.should.eql(httpsResponse);
        done();
      });
    });
  });

});
