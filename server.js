'use strict';

var restify = require('restify');
var config = require('config');
var emailer = require('nodemailer');
var database = require('mongoose');

var api = require('./api/api');

// check if configuration is found and loaded
if (!config.server) {
  console.error('Configuration files are not found at ' + process.cwd() +
    '/config or no NODE_CONFIG_DIR is specified');
  process.exit(-1);
}

// use Restify REST server
var server = restify.createServer();

// allow incoming json content processing
server.use(restify.acceptParser(server.acceptable));
server.use(restify.jsonBodyParser());

// setup email sending service
var emailTransporter;
if (config.email.sendEmail) {
  emailTransporter = emailer.createTransport({
    service: config.email.service,
    auth: {
      user: config.email.user,
      pass: config.email.password
    }
  });
}

// define api endpoints
api(server, emailTransporter);

// connect to mongodb
var connect = function () {
  database.connect(config.database.credentials);
};
connect();
database.connection.on('error', console.log);
database.connection.on('disconnected', connect);

// launch the api server
server.listen(process.env.PORT || config.server.port, function () {
  console.log('JSON HTTP API server is listening at %s', server.url);
});

module.exports = server;
