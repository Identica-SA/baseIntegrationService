const config    = require('./../config/config.json')[process.env.NODE_ENV || 'development'];
const mongoose  = require('mongoose');

//------- CONST URL -------

const CONN_URL = `${config.database.connectionType}://${config.database.user}:${config.database.password}@${config.database.url}`;

// ------------- FUNCTION DEFINITION  ---------------
var connect = () => {
  mongoose.set("strictQuery", false);
  var db = mongoose.connection;

  db.on('connecting', function () {
    console.log('connecting to MongoDB...');
  });

  db.on('error', function (error) {
    console.log('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
  });

  db.on('connected', function () {
    console.log('MongoDB connected!');
  });

  db.once('open', function () {
    console.log('MongoDB connection opened!');
  });

  db.on('reconnected', function () {
    console.log('MongoDB reconnected!');
  });

  db.on('disconnected', function () {
    console.log('MongoDB disconnected!');
    mongoose.connect(CONN_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  mongoose.connect(CONN_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

const gracefulExit = async () => {
  try {
    await mongoose.connection.close();
    utils.logging(
      'Mongoose default connection with DB is disconnected through app termination'
    );
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful exit: ', error);
    process.exit(1);
  }
};

module.exports = { connect, gracefulExit };
