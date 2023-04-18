let config    = require('./../config/config.json')[process.env.NODE_ENV || 'development'];
var mongoose  = require('mongoose');

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
    console.log('MongoDB connected!: ' + config.database.url);
  });

  db.once('open', function () {
    console.log('MongoDB connection opened!');
  });

  db.on('reconnected', function () {
    console.log('MongoDB reconnected!');
  });

  db.on('disconnected', function () {
    console.log('MongoDB disconnected!');
    mongoose.connect(config.database.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  mongoose.connect(config.database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

var gracefulExit = () => {
  mongoose.connection.close(function () {
    console.log(
      'Mongoose default connection with DB is disconnected through app termination'
    );
    process.exit(0);
  });
};

module.exports = { connect, gracefulExit };
