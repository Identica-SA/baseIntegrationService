function Base(code, message, status) {
  Error.call(this)
  this.code = code
  this.status = status || 500
  this.error = message
}

Base.prototype = Object.create(Error.prototype)
Base.prototype.constructor = Base

function IdentiError(data, status) {
  Base.call(this, data.code, data.error || data.message, status)
  Error.captureStackTrace(this, this.constructor)
  if (Object.keys(data).length > 2) {
    const { code, error, ...args } = data
    for (const key in args) {
      if (key in args) {
        this[key] = args[key]
      }
    }
  }

  this.name = 'IdentiError'
}

IdentiError.prototype = Object.create(Base.prototype)
IdentiError.prototype.constructor = IdentiError

module.exports = IdentiError
