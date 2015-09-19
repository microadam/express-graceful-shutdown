var extend = require('lodash.assign')

module.exports = createMiddleware

function createMiddleware(server, opts) {

  var shuttingDown = false
    , options = extend(
      { logger: console
      , forceTimeout: 30000 }, opts)

  // Graceful shutdown taken from: http://blog.argteam.com/
  process.on('SIGTERM', function () {
    options.logger.warn('Received kill signal (SIGTERM), shutting down')
    gracefulExit()
  })

  function gracefulExit() {
    // if we are already shutting down, don't need to do anything
    if (shuttingDown) return

    // Don't bother with graceful shutdown on development to speed up round trip
    if (!process.env.NODE_ENV) return process.exit(1)

    shuttingDown = true
    options.logger.warn('Attepming to gracefully exit...')

    setTimeout(function () {
      options.logger.error('Could not close connections in time, forcefully shutting down')
      process.exit(1)
    }, options.forceTimeout)

    server.close(function () {
      options.logger.info('Closed out remaining connections.')
      process.exit()
    })

  }

  function middleware(req, res, next) {
    if (!shuttingDown) return next()
    res.set('Connection', 'close')
    res.send(503, 'Server is in the process of restarting.')
  }

  return {
    middleware: middleware
  , gracefulExit: gracefulExit
  }

}
