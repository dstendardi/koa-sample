var Immutable = require('immutable');

/**
 * Load given listeners definition and register them
 * using the given emitter
 *
 * @param {Object} emitter
 */
module.exports = function (emitter) {

  return {
    /**
     * Register listener at the given path
     *
     * @param {String} path
     * @param {Object} [override]
     */
    add: function (path, override) {
      var listeners = require(path);

      Immutable.Map(listeners)
        .merge(override || {})
        .forEach(function (fn, name) {
          emitter.on(name, fn)
        });

      return this;
    }
  }
};