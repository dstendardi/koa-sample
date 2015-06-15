var app = require('./app');
var nock = require('nock');
var request = require('supertest').agent(app.listen());

describe('app', function () {

  describe('when GET /', function () {

    it('should return an aggregated result', function (done) {

      nock('http://localhost:4000')
        .get('/foo')
        .reply(200, {
          "foo": "bar"
        });

      nock('http://localhost:4000')
        .get('/bar')
        .reply(200, {
          "bar": "foo"
        });

      request
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect({
          "foo": {
            "foo": "bar"
          },
          "bar": {
            "bar": "foo"
          }
        }, done);
    })
  })
})