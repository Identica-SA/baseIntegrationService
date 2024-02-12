const cors    = require('cors')
const http    = require('http')
const express = require('express')
const process = require('node:process')

var intRoute  = require('./routes/[NAME_INIT]Routes')
var config    = require('./config/config.json')[process.env.NODE_ENV || 'development']

// --- VARIABLES ---
var app = express()
var router = express.Router()

router.use(function (req, res, next) {
  next()
})

if (process.env.NODE_ENV == 'production') {
  utils.logging('PRODUCCION')
} else if (process.env.NODE_ENV === 'qa') {
  utils.logging('QA')
} else {
  utils.logging('DEVELOPMENT')
}

app.disable('x-powered-by')
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use('/', intRoute)

app.get('/test', function (req, res) {
  return res.status(200).json({
    code: '[NAME_INIT]001',
    message: 'Test Good'
  })
})

// ***** HTTP SERVER *****
var httpServer = http.createServer(app).listen(config.server.http.port, function () {
  utils.logging(`Server listening on port ${config.server.http.port}`)
  utils.logging(`Worker ${process.pid} started`)
})

// ***** ERROR CATCH *****
process.on('uncaughtException', function (err) {
  utils.error('ERROR RPA: ' + err)
})

app.on('error', function (err) {
  utils.error('GEN ERROR : ' + err)
})

/*
if (config.database.init) {
    var dataBase    = require('./utils/database');
    dataBase.connect();
    process.on ('SIGINT', dataBase.gracefulExit)
            .on('SIGTERM', dataBase.gracefulExit);
}
DB*/

exports = app
