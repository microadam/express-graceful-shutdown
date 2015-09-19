# express-graceful-shutdown

Ensure that during shutdown express returns correctly with a 503

[![build status](https://secure.travis-ci.org/serby/express-graceful-shutdown.png)](http://travis-ci.org/serby/express-graceful-shutdown)

## Installation

```
npm install express-graceful-shutdown --save
```

## Usage

```js
var express = require('express')
  , app = express()
  , gracefulShutdownMiddleware = require('express-graceful-shutdown')(app)

app.use(gracefulShutdownMiddleware.middleware)
```

If you wish to gain direct access to the `gracefulExit` function or indicate that the server is already shutting down, this is available like so:

```js
var express = require('express')
  , app = express()
  , gracefulShutdownMiddleware = require('express-graceful-shutdown')(app)
  , gracefulExit = gracefulShutdownMiddleware.gracefulExit
  , setShuttingDown = gracefulShutdownMiddleware.setShuttingDown

gracefulExit()
setShuttingDown()
```

## Credits
[Paul Serby](https://github.com/serby/)
