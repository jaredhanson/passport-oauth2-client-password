var vows = require('vows');
var assert = require('assert');
var util = require('util');
var clientPassword = require('../lib');


vows.describe('passport-oauth2-client-password').addBatch({

  'module': {
    'should export Strategy': function (x) {
      assert.isFunction(clientPassword.Strategy);
    },
  },

}).export(module);
