var logger = require('../../../../lib/middleware/logger-middleware');
var expect = require('chai').expect;
var koa = require('koa');
var http = require('http');
var request = require('supertest');


describe('logger-middleware', function () {

  it('should log request and response', function (done) {

    var logs = [];
    var app = koa();
    app.on('log', function(log) {
      logs.push(log);
    });

    app
      .use(function * (next) {
        this.id = "abcde";
        yield next;
      })
      .use(logger(app))
      .use(function * () {
        this.body = "hello";
      });

    request(http.createServer(app.callback())).
      get('/')
      .expect(200)
      .end(function () {
        expect(logs.length).to.equal(2);
        expect(logs[0]).to.match(/server.request/, "server request is logged");
        expect(logs[1]).to.match(/server.response/, "server response is logged");
        done();
      });
  });
});