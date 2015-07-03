module.exports = function factory(fn) {

  return function * validatorMiddleware(next) {
    yield fn;
    if (this.haveValidationError()) {
      this.body = {errors: this.validationErrors()};
    } else {
      yield next;
    }
  };
};