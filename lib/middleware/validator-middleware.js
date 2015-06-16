module.exports = function (fn) {
  return function *(next) {
    yield fn;
    if (this.haveValidationError()) {
      this.body = {errors: this.validationErrors()};
    } else {
      yield next;
    }
  };
};