var vows = require('vows');
var assert = require('assert');
var util = require('util');
var clientPassword = require('passport-oauth2-client-password');


vows.describe('passport-oauth2-client-password').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(clientPassword.version);
    },
    
    'should export Strategy': function (x) {
      assert.isFunction(clientPassword.Strategy);
    },
  },
  
}).export(module);
