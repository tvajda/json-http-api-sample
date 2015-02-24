'use strict';

process.env.NODE_ENV = 'test';

var hippie = require('hippie');
var mongoose = require('mongoose');
var config = require('config');
var async = require('async');

var server = require('../../server');

// HTTP codes
var HTTP_CREATE_FAILED = 400;
var HTTP_CREATE_SUCCEEDED = 201;
var HTTP_GET_FAILED = 404;
var HTTP_GET_SUCCEEDED = 200;

describe('Server', function () {

  before(function (done) {

    // clean up test database
    var collection;
    for (collection in mongoose.connection.collections) {
      if (mongoose.connection.collections.hasOwnProperty(collection)) {
        mongoose.connection.collections[collection].drop();
      }
    }
    done();
  })

  describe('Test /registration service', function () {

    it('tests a valid registration', function (done) {
      hippie(server)
        .json()
        .post('/api/registration')
        .send({name: 'Test User', email: 'email@example.com'})
        .header('Content-Type', 'application/json')
        .header('Accept', 'application/json')
        .expectStatus(HTTP_CREATE_SUCCEEDED)
        .end(function (err) {
          if (err) {
            throw err;
          }
          done();
        });
    });

    it('tests an invalid registration (invalid email)', function (done) {
      hippie(server)
        .json()
        .post('/api/registration')
        .send({name: 'Test User', email: 'emailexample.com'})
        .header('Content-Type', 'application/json')
        .header('Accept', 'application/json')
        .expectStatus(HTTP_CREATE_FAILED)
        .end(function (err) {
          if (err) {
            throw err;
          }
          done();
        });
    });

  });

  describe('Test /users service', function () {

    it('tests an invalid request (missing token)', function (done) {
      hippie(server)
        .json()
        .get('/api/users')
        .expectStatus(HTTP_GET_FAILED)
        .end(function (err) {
          if (err) {
            throw err;
          }
          done();
        });
    });

  });
});