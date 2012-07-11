NODE = node
TEST = ./node_modules/.bin/vows
TESTS ?= test/*-test.js

test:
	@NODE_ENV=test NODE_PATH=lib $(TEST) $(TEST_FLAGS) $(TESTS)

docs: docs/api.html

docs/api.html: lib/passport-oauth2-client-password/*.js
	dox \
		--title Passport-OAuth2-Client-Password \
		--desc "OAuth 2.0 client password authentication strategy for Passport" \
		$(shell find lib/passport-oauth2-client-password/* -type f) > $@

docclean:
	rm -f docs/*.{1,html}

.PHONY: test docs docclean
