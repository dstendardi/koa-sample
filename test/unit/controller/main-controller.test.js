var app = require('../../../app');
var nock = require('nock');
var request = require('supertest')
  .agent(app.listen());

describe('app', function () {

  describe('when GET /', function () {

    it('should return an aggregated result', function (done) {

      nock('http://localhost:4000')
        .get('/foo')
        .matchHeader('Request-id', /.+/)
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
        .set('Accept', 'application/json')
        .query({foo: 'bar'})
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
    });

    it('should return an error when parameter foo is empty', function (done) {

      request
        .get('/')
        .query({foo: ''})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect({
          "errors": [
            {
              "msg": "Invalid value",
              "param": "foo",
              "value": ""
            }
          ]
        }, done);
    });
  })

  describe('when GET /exception', function () {

    it('should log exception', function (done) {
      request
        .get('/exception')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .expect({ error: 'error message' }, done);
    });
  })
});