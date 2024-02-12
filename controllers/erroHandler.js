const utils = require('../utility/utils')

module.exports = function () {
  return function (err, _req, res, _next) {
    const { status, name, ...data } = err
    return utils.sendResponseAndLogging(res, status, data)
  }
}
