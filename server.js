// CONFIG PARAMS
var config = require('config'); // loads environment-dependent configuration parameters from config folder

var DATABASE_CREDENTIALS = config.get('database.credentials');
var SERVER_PORT = process.env.PORT || config.get('server.port');
var SEND_EMAIL = config.get('email.send_email');
var EMAIL_SERVICE = config.get('email.service');
var EMAIL_USER = config.get('email.user');
var EMAIL_PASSWORD = config.get('email.password');


// USE Restify REST server
var restify = require('restify');
var server = restify.createServer();

// SETUP INCOMING CONTENT PROCESSING
server.use(restify.acceptParser(server.acceptable));
server.use(restify.jsonBodyParser());

// EMAIL SENDING SERVICE
var emailer = require('nodemailer');
var emailTransporter = undefined;
if (SEND_EMAIL) {
    emailTransporter = emailer.createTransport({
        service: EMAIL_SERVICE,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        }
    });
}
;

// DEFINE API ENDPOINTS
require('./api/api')(server, emailTransporter);

// CONNECT TO MONGODB DATABASE
var database = require('mongoose');

var connect = function () {
    database.connect(DATABASE_CREDENTIALS);
};
connect();
database.connection.on('error', console.log);
database.connection.on('disconnected', connect);

// LAUNCH API SERVER
server.listen(SERVER_PORT, function () {
    console.log('JSON HTTP API server is listening at %s', server.url);
});

module.exports = server;
