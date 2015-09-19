var rewire = require('rewire')
  , createExpressGracefulShutdown = rewire('..')
  , assert = require('assert')
  , noop = function () {}
  , logger = require('mc-logger')

describe('express-graceful-shutdown', function () {

  describe('.middleware', function () {

    it('should be a function' , function () {
      assert.equal(typeof createExpressGracefulShutdown({}).middleware, 'function')
    })

    it('should call next() when not shutting down' , function (done) {
      createExpressGracefulShutdown({}).middleware(null, null, done)
    })

    it('should send a 503 when shutting down' , function (done) {
      var gracefulShutdown
      createExpressGracefulShutdown.__set__('process'
        , { env: { NODE_ENV: 'testing' }, exit: noop, on: function (name, fn) {
            gracefulShutdown = fn
          }
        })

      var stubServer = { close: noop }
        , stubResponse =
        { send: function (code) {
            assert.equal(code, 503)
            done()
          }
          , set: noop
        }
        , middleware = createExpressGracefulShutdown(stubServer, { logger: logger } ).middleware

      gracefulShutdown()

      middleware(null, stubResponse)
    })

    it('should shut down immediately when NODE_ENV is not set', function (done) {

      var gracefulShutdown
      createExpressGracefulShutdown.__set__('process'
        , { env: {}
          , exit: function () { done() }
          , on: function (name, fn) { gracefulShutdown = fn }
          })

      createExpressGracefulShutdown({}, { logger: logger } )
      gracefulShutdown()

    })
  })

  describe('.gracefulExit', function () {

    it('should be a function' , function () {
      assert.equal(typeof createExpressGracefulShutdown({}).gracefulExit, 'function')
    })

  })

})
