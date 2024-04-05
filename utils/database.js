#!/usr/bin/env node
const process = require('node:process')
const mongoose = require('mongoose')
const Logger = require('./logger')
const logger = new Logger()
const config = require('./../config/config.json')[process.env.NODE_ENV || 'development']

const conUrl = `${config.database.connectionType}://${config.database.user}:${config.database.password}@${config.database.url}`
// ESTA ES LA URL FORMADA CON LOS DATOS DEL CONFIG QUE DEBE QUEDAR ASI:
// "database": {
//   "init": true,
//   "connectionType":"mongodb",
//   "url": "lo que esta despues del @",
//   "user": "identiAdmin",
//   "password:": "identica"
// }
// LO UNICO RARO ES EL connectionType Y ES DEBIDO A LA DIFERENCIA DE URL DE BD LOCAL A ATLAS

// ------------- FUNCTION DEFINITION  ---------------
const connect = () => {
  mongoose.set('strictQuery', false)
  const db = mongoose.connection

  db.on('connecting', function () {
    logger.info('connecting to MongoDB...')
  })

  db.on('error', function (error) {
    logger.info('Error in MongoDb connection: ' + error)
    mongoose.disconnect()
  })

  db.on('connected', function () {
    logger.info('MongoDB connected!') // QUITÉ DE AQUI QUE CONSOLEE LA URL DE CONEXION A LA BD, MAXIMO LE ACEPTO UNA VARIABLE QUE DIGA SI FUE QA O PROD
  })

  db.once('open', function () {
      logger.info('MongoDB connection opened!')
  })

  db.on('reconnected', function () {
    logger.info('MongoDB reconnected!')
  })

  db.on('disconnected', function () {
    logger.info('MongoDB disconnected!')
    mongoose.connect(conUrl, {
      // conURL esta arriba
      maxPoolSize: 50
    })
  })

  mongoose.connect(conUrl, {
    // conURL esta arriba
    maxPoolSize: 50
  })
}

// AQUI REEMPLACÉ POR EL METODO CON AWAIT, POR LO QUE EL GRACEFUL EXIT ESTA TIRANDO ERROR
const gracefulExit = async () => {
  try {
    await mongoose.connection.close()
    logger.info('Mongoose default connection with DB is disconnected through app termination')
    process.exit(0)
  } catch (err) {
    utils.error('Error during graceful exit: ', err)
    process.exit(1)
  }
}

module.exports = { connect, gracefulExit }
