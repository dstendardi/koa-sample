var Joi = require('joi');
var _ = require('lodash');

module.exports = function factory(schemes) {

  return function * validatorMiddleware(next) {

    var request = this.request;

    var result = _.transform(schemes, function (result, value, key) {
      var r = Joi.validate(request[key], Joi.object().keys(value));
      if (r.error) {
        result[key] = r.error.details
      }
    });

    if (! _.isEmpty(result)) {
      this.status = 400;
      this.body = result;
    } else {
      yield next
    }
  };
};