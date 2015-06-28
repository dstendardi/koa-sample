module.exports = function () {

  return function *(next) {

    this.app.emit('server.http-request', this, this.request);

    yield next;

    this.app.emit('server.http-response', this, this.response)
  }
}