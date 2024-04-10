const cors = require('cors')
const http = require('http')
const express = require('express')
const process = require('node:process')
const Logger = require('./utils/logger')

const config = require('./config/config.json')[process.env.NODE_ENV || 'development']

const logger = new Logger(config.tagsToRemove)
const testRoute = require('./routes/testRoute')
const baseRoute = require('./routes/baseRoute')

// --- VARIABLES ---
const app = express()

if (process.env.NODE_ENV === 'production') {
  logger.info('PRODUCTION')
} else if (process.env.NODE_ENV === 'qa') {
  logger.info('QA')
} else {
  logger.info('DEVELOPMENT')
}

app.disable('x-powered-by')
app.use(express.json({ limit: '500mb' }))
app.use(express.urlencoded({ limit: '500mb', extended: true }))
app.use(cors())
app.use(logger.middleware)

// set variables at app level
// app.set('config', config)
// app.set('jwtKey', config.session.key)

app.use('/', testRoute)
app.use('/', baseRoute)

// ***** HTTP SERVER *****
const server = http.createServer(app).listen(config.server.http.port, () => {
  logger.info(`Server listening on port ${server.address().port}`)
  logger.info(`Worker ${process.pid} started`)
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
