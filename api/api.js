'use strict';

var async = require('async');
var jwt = require('jwt-simple');
var config = require('config');

var UserModel = require('model/user');

// TOKEN
var SECRET_KEY = 'json-api-sample-secret-key';

// HTTP codes
var HTTP_CREATE_FAILED = 400;
var HTTP_CREATE_SUCCEEDED = 201;
var HTTP_GET_FAILED = 404;
var HTTP_GET_SUCCEEDED = 200;

function constructUserURL(server, token) {
  return server.url + '/api/users/' + token;
}

function sendEmail(user, emailTransporter, callback) {
  if (emailTransporter) {
    emailTransporter.sendMail({
      from: config.email.from_address,
      to: user.email,
      subject: config.email.subject,
      text: user.url
    }, callback);
  } else {
    callback();
  }
}

function findUserAndValidate(userId, callback) {
  UserModel.findById(userId, function userRetrieved(err, user) {
    if (!err && !user) {
      err = new Error('Specified user couldn\'t be found in the database');
    }
    callback(err, user);
  });
}

module.exports = function createEndPoints(server, emailTransporter) {

  server.post('/api/registration', function (req, res) {
    var name = req.params.name;
    var email = req.params.email;

    var user = new UserModel({name: name, email: email});

    // create user token
    try {
      user.token = jwt.encode(user.id, SECRET_KEY);
    } catch (err) {
      console.error(err);
      res.send(HTTP_CREATE_FAILED, err);
      return;
    }

    user.url = constructUserURL(server, user.token);

    async.series([
      function (callback) {
        user.save(callback);
      },
      function (callback) {
        sendEmail(user, emailTransporter, callback);
      }],
      function final(err) {
        if (err) {
          console.error(err);
          res.send(HTTP_CREATE_FAILED, err);
        } else {
          res.setHeader('Location', user.url);
          res.send(HTTP_CREATE_SUCCEEDED, JSON.stringify(user));
        }
      });
  });

  server.get('/api/users/:token', function (req, res) {
    var token = req.params.token;

    // decode userId from token
    var userId;
    try {
      userId = jwt.decode(token, SECRET_KEY);
    } catch (err) {
      console.error(err);
      res.send(HTTP_CREATE_FAILED, err);
      return;
    }

    async.series([
      function (callback) {
        findUserAndValidate(userId, callback);
      },
      function (callback) {
        UserModel.find(callback);
      }],
      function final(err, results) {
        if (!err) {
          var users = results[results.length - 1];
          res.send(HTTP_GET_SUCCEEDED, JSON.stringify(users));
        } else {
          console.error(err);
          res.send(HTTP_GET_FAILED);
        }
      });
  });
};
