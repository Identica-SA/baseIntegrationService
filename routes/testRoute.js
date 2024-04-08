const express = require('express')
const IdentiError = require('../utils/identiError')
const { checkInput, errorHandler } = require('../utils/utils')
const codes = require('../utils/codes')

const router = express.Router()

function test(req, res, next) {
  try {
    return res.status(200).send(codes.[NAME_INIT]100)
  } catch (err) {
    return next(
      new IdentiError(
        {
          ...codes.DUM000,
          error: err.message === undefined ? err : err.message
        },
        200
      )
    )
  }
}

router.get('/api/test', test, errorHandler)

module.exports = router
