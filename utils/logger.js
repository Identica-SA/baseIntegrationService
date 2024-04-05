const onHeaders = require('on-headers')
const onFinished = require('on-finished')
const clfDate = require('clf-date')
const { isNull, isUndefined, isObject, isString, isFunction, isError } = require('./utils')

const format = require('@ladjs/format-util')
const formatSpecifiers = require('format-specifiers')
const parseErr = require('parse-err')

class Logger {
  constructor(tagsToRemove = ['pdf', 'token']) {
    if (!Logger.instance) {
      this.config = {
        logger: console,
        meta: {},
        errorProps: [],
        message: this.apacheCommonLogFormat.bind(this),
        tagsToRemove: tagsToRemove
      }

      // parse arg helper
      this.parseArg = this.parseArg.bind(this)

      // bind helper functions for each log level
      for (const level of Object.keys(this.config.logger).filter((key) => isFunction(this.config.logger[key]))) {
        this[level] = (...args) => {
          // support format specifiers
          if (typeof args[0] === 'string' && formatSpecifiers.some((t) => args[0].includes(t)) && args[1]) {
            args.slice(1).forEach((arg) => {
              args[0] = format(args[0], arg)
              delete args[1]
            })
            args = [args[0]]
          } else if (args[1]) args[1] = this.parseArg(args[1])
          return this.config.logger[level](...Array.prototype.slice.call(args))
        }
      }

      this.err = this.error
      this.warning = this.warn
      this.setMeta = this.setMeta.bind(this)
      this.setUser = this.setUser.bind(this)
      this.stringify = this.stringify.bind(this)

      this.middleware = this.middleware.bind(this)
      Logger.instance = this
    }
    return Logger.instance
  }

  parseArg(arg = {}) {
    if (isObject(arg)) {
      Object.assign(arg, this.config.meta)
      return arg
    }

    if (isUndefined(arg) || isNull(arg)) arg = {}
    else if (isError(arg)) arg = { err: parseErr(arg, this.config.errorProps) }
    else if (Array.isArray(arg)) arg = { value: arg }
    else if (isString(arg)) arg = { value: arg }
    else if (typeof arg === 'number') arg = { value: arg }
    else if (isFunction(arg)) arg = { value: arg.toString() }
    else arg = {}
    Object.assign(arg, this.config.meta)
    return arg
  }

  setMeta(meta = {}) {
    this.config.meta = meta
  }

  setUser(user = {}) {
    this.config.meta.user = user
  }

  onResponseSent(res) {
    const originalSend = res.send
    res.send = function () {
      originalSend.apply(res, arguments)
      res.bodySend = arguments[0]
    }
  }

  middleware(req, res, next) {
    const logger = {}
    var startAt = process.hrtime()
    var startTime = Date.now()
    req.startAtSymbol = startAt
    req.startTimeSymbol = startTime

    for (const key of Object.keys(this.config.logger).filter((key) => isFunction(this.config.logger[key]))) {
      logger[key] = (...args) => {
        // support format specifiers
        if (typeof args[0] === 'string' && formatSpecifiers.some((t) => args[0].includes(t)) && args[1]) {
          args.slice(1).forEach((arg) => {
            args[0] = format(args[0], arg)
            delete args[1]
          })
          args = [args[0]]
        } else if (args[1]) args[1] = this.parseArg(args[1])
        return this.config.logger[key](...Array.prototype.slice.call(args))
      }
    }

    onHeaders(res, function () {
      var diff = process.hrtime(startAt)
      var time = diff[0] * 1e3 + diff[1] * 1e-6
      var val = time.toFixed(2)
      val += 'ms'
      res.setHeader('X-Response-Time', val)
    })

    this.onResponseSent(res)

    onFinished(res, (err) => {
      if (err) logger.error(err)
      let level = 'info'
      if (res.statusCode >= 500) level = 'error'
      else if (res.statusCode >= 400) level = 'warn'
      const message = this.config.message({
        level,
        req: res.req,
        res,
        data: res.bodySend
      })
      if (err) {
        logger[level](message || err.message, { err })
      } else if (message) {
        logger[level](message)
      }
    })

    req.log   = logger
    res.log   = logger
    req.logger = logger
    res.logger = logger

    return next()
  }

  apacheCommonLogFormat(options) {
    const { req, res, data } = options
    const startTime = this.getStartTime(req)

    const message = [
      req.ip,
      '-',
      clfDate(startTime),
      req.method,
      req.url,
      `HTTP/${req.httpVersionMajor}.${req.httpVersionMinor}`,
      res.statusCode,
      res.getHeader('content-length') || '-',
      '-',
      res.getHeader('X-Response-Time') || '-',
      '-',
      this.stringify(data) || '-'
    ].join(' ')

    return message
  }

  getStartTime(request) {
    let startTime = new Date()
    if (request.startTimeSymbol instanceof Date) startTime = request.startTimeSymbol
    else if (typeof request.startTimeSymbol === 'number') startTime = new Date(request.startTimeSymbol)
    return startTime
  }

  stringify(data) {
    if (data instanceof Object) {
      if (data.code && typeof data.code === 'string' && (data.code.endsWith('001') || data.code.endsWith('100'))) {
        const newData = this.removeProperties(data, this.config.tagsToRemove)
        return JSON.stringify(newData)
      } else return JSON.stringify(data)
    } else return data
  }

  removeProperties(obj, propertiesToRemove) {
    if (typeof obj !== 'object' || obj === null || obj.length === 0) {
      // If it's not an object or is null, return the current value
      return obj
    }

    // Create a shallow copy of the original object
    const newObj = { ...obj }

    // Remove specified properties
    propertiesToRemove.forEach((prop) => {
      if (newObj.hasOwnProperty(prop)) {
        delete newObj[prop]
      }
    })

    // Recursively apply the function to object properties
    for (const key in newObj) {
      if (newObj.hasOwnProperty(key) && typeof newObj[key] === 'object') {
        newObj[key] = this.removeProperties(newObj[key], propertiesToRemove)
      }
    }

    return newObj
  }
}

module.exports = Logger
