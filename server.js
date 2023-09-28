
const cors      = require("cors");
const http      = require("http");
const express   = require("express");
const process   = require('node:process');

var intRoute    = require('./routes/[NAME_INIT]Routes');
var config      = require("./config/config.json")[process.env.NODE_ENV || 'development'];

// --- VARIABLES ---
var app         = express();
var router      = express.Router();

router.use(function (req, res, next) {
    next();
});

if (process.env.NODE_ENV == "production"){
    console.log ("PRODUCCION");
} else {
    console.log ("DEVELOPMENT");
}

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/", intRoute);

app.get('/test', function (req, res) {
  return res.status(200).json({
    code: '[NAME_INIT]001',
    message: 'Test Good'
  });
})

// ***** HTTP SERVER *****
var httpServer = http.createServer(app).listen(config.server.http.port, function () {
    console.log( `Server listening on port ${server.address().port}` );
    console.log( `Worker ${process.pid} started` );
});

// ***** ERROR CATCH *****
process.on("uncaughtException", function (err) {
    console.error( "ERROR RPA: " + err);
});

app.on("error", function (err) {
    console.error("GEN ERROR : " + err);
});

/*
if (config.database.init) {
    var dataBase    = require('./utils/database');
    dataBase.connect();
    process.on ('SIGINT', dataBase.gracefulExit)
            .on('SIGTERM', dataBase.gracefulExit);
}
DB*/




exports = app;
