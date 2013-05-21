var vows = require('vows');
var assert = require('assert');
var util = require('util');
var ClientPasswordStrategy = require('passport-oauth2-client-password/strategy');


vows.describe('ClientPasswordStrategy').addBatch({

  'strategy': {
    topic: function() {
      return new ClientPasswordStrategy(function(){});
    },

    'should be named oauth2-client-password': function (strategy) {
      assert.equal(strategy.name, 'oauth2-client-password');
    },
  },

  'strategy handling a request': {
    topic: function() {
      var strategy = new ClientPasswordStrategy(function(clientId, clientSecret, done) {
        if (clientId == 'c1234' && clientSecret == 'shh-its-a-secret') {
          done(null, { id: clientId });
        } else {
          done(null, false);
        }
      });
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(null, user);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.error = function() {
          self.callback(new Error('should-not-be-called'));
        }

        req.body = {};
        req.body['client_id'] = 'c1234';
        req.body['client_secret'] = 'shh-its-a-secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should not generate an error' : function(err, user) {
        assert.isNull(err);
      },
      'should authenticate' : function(err, user) {
        assert.equal(user.id, 'c1234');
      },
    },
  },

  'strategy that verifies a request with additional info': {
    topic: function() {
      var strategy = new ClientPasswordStrategy(function(clientId, clientSecret, done) {
        if (clientId == 'c1234' && clientSecret == 'shh-its-a-secret') {
          done(null, { id: clientId }, { foo: 'bar' });
        } else {
          done(null, false);
        }
      });
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user, info) {
          self.callback(null, user, info);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.error = function() {
          self.callback(new Error('should-not-be-called'));
        }

        req.body = {};
        req.body['client_id'] = 'c1234';
        req.body['client_secret'] = 'shh-its-a-secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should not generate an error' : function(err, user) {
        assert.isNull(err);
      },
      'should authenticate' : function(err, user) {
        assert.equal(user.id, 'c1234');
      },
      'should authenticate with additional info' : function(err, user, info) {
        assert.equal(info.foo, 'bar');
      },
    },
  },

  'strategy handling a request that is not verified': {
    topic: function() {
      var strategy = new ClientPasswordStrategy(function(clientId, clientSecret, done) {
        done(null, false);
      });
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function() {
          self.callback(null);
        }
        strategy.error = function() {
          self.callback(new Error('should-not-be-called'));
        }

        req.body = {};
        req.body['client_id'] = 'c1234';
        req.body['client_secret'] = 'shh-its-a-secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should fail authentication' : function(err, user) {
        // fail action was called, resulting in test callback
        assert.isNull(err);
      },
    },
  },

  'strategy that errors while verifying request': {
    topic: function() {
      var strategy = new ClientPasswordStrategy(function(clientId, clientSecret, done) {
        done(new Error('something went wrong'));
      });
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.error = function(err) {
          self.callback(null, err);
        }

        req.body = {};
        req.body['client_id'] = 'c1234';
        req.body['client_secret'] = 'shh-its-a-secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should not call success or fail' : function(err, e) {
        assert.isNull(err);
      },
      'should call error' : function(err, e) {
        assert.instanceOf(e, Error);
        assert.equal(e.message, 'something went wrong');
      },
    },
  },

  'strategy handling a request without a body': {
    topic: function() {
      var strategy = new ClientPasswordStrategy(function(clientId, clientSecret, done) {
        done(null, false);
      });
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function(challenge, status) {
          self.callback(null, challenge, status);
        }
        strategy.error = function() {
          self.callback(new Error('should-not-be-called'));
        }

        //req.body = {};
        //req.body['client_id'] = 'c1234';
        //req.body['client_secret'] = 'shh-its-a-secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should not call success or error' : function(err, challenge, status) {
        assert.isNull(err);
      },
      'should fail authentication with default status' : function(err, challenge, status) {
        assert.isUndefined(challenge);
      },
    },
  },

  'strategy handling a request without a client_id': {
    topic: function() {
      var strategy = new ClientPasswordStrategy(function(clientId, clientSecret, done) {
        done(null, false);
      });
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function(challenge, status) {
          self.callback(null, challenge, status);
        }
        strategy.error = function() {
          self.callback(new Error('should-not-be-called'));
        }

        req.body = {};
        //req.body['client_id'] = 'c1234';
        req.body['client_secret'] = 'shh-its-a-secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should not call success or error' : function(err, challenge, status) {
        assert.isNull(err);
      },
      'should fail authentication with default status' : function(err, challenge, status) {
        assert.isUndefined(challenge);
      },
    },
  },

  'strategy handling a request without a client_secret': {
    topic: function() {
      var strategy = new ClientPasswordStrategy(function(clientId, clientSecret, done) {
        done(null, false);
      });
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function(challenge, status) {
          self.callback(null, challenge, status);
        }
        strategy.error = function() {
          self.callback(new Error('should-not-be-called'));
        }

        req.body = {};
        req.body['client_id'] = 'c1234';
        //req.body['client_secret'] = 'shh-its-a-secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should not call success or error' : function(err, challenge, status) {
        assert.isNull(err);
      },
      'should fail authentication with default status' : function(err, challenge, status) {
        assert.isUndefined(challenge);
      },
    },
  },

  'strategy constructed without a verify callback': {
    'should throw an error': function () {
      assert.throws(function() { new ClientPasswordStrategy() });
    },
  },

  'strategy with passReqToCallback=true option': {
    topic: function() {
      var strategy = new ClientPasswordStrategy({passReqToCallback:true}, function(req, clientId, clientSecret, done) {
        assert.isNotNull(req);
        if (clientId == 'c1234' && clientSecret == 'shh-its-a-secret') {
          done(null, { id: clientId });
        } else {
          done(null, false);
        }
      });
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(null, user);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.error = function() {
          self.callback(new Error('should-not-be-called'));
        }

        req.body = {};
        req.body['client_id'] = 'c1234';
        req.body['client_secret'] = 'shh-its-a-secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should not generate an error' : function(err, user) {
        assert.isNull(err);
      },
      'should authenticate' : function(err, user) {
        assert.equal(user.id, 'c1234');
      },
    },
  },

}).export(module);
