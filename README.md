# passport-oauth2-client-password

OAuth 2.0 client password authentication strategy for [Passport](https://github.com/jaredhanson/passport).

This module lets you authenticate requests containing client credentials in the
request body, as [defined](http://tools.ietf.org/html/draft-ietf-oauth-v2-27#section-2.3.1)
by the OAuth 2.0 specification.  These credentials are typically used protect
the token endpoint and used as an alternative to HTTP Basic authentication.

## Installation

    $ npm install passport-oauth2-client-password

## Usage

#### Configure Strategy

The OAuth 2.0 client password authentication strategy authenticates clients
using a client ID and client secret.  The strategy requires a `verify` callback,
which accepts those credentials and calls `done` providing a client.

    passport.use(new ClientPasswordStrategy(
      function(clientId, clientSecret, done) {
        Clients.findOne({ clientId: clientId }, function (err, client) {
          if (err) { return done(err); }
          if (!client) { return done(null, false); }
          if (client.clientSecret != clientSecret) { return done(null, false); }
          return done(null, client);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'oauth2-client-password'`
strategy, to authenticate requests.  This strategy is typically used in
combination with HTTP Basic authentication (as provided by [passport-http](https://github.com/jaredhanson/passport-http)),
allowing clients to include credentials in the request body.

For example, as route middleware in an [Express](http://expressjs.com/)
application, using [OAuth2orize](https://github.com/jaredhanson/oauth2orize)
middleware to implement the token endpoint:

    app.get('/profile', 
      passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
      oauth2orize.token());

## Examples

The [example](https://github.com/jaredhanson/oauth2orize/tree/master/examples/express2)
included with [OAuth2orize](https://github.com/jaredhanson/oauth2orize)
demonstrates how to implement a complete OAuth 2.0 authorization server.
`ClientPasswordStrategy` is used to authenticate clients as they request access
tokens from the token endpoint.

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/jaredhanson/passport-oauth2-client-password.png)](http://travis-ci.org/jaredhanson/passport-oauth2-client-password)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

(The MIT License)

Copyright (c) 2011 Jared Hanson

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
