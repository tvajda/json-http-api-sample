'use strict';

process.env.NODE_ENV = 'test';

var hippie = require('hippie');
var server = require('../../server');
var database_utils = require('../database_utils');

// HTTP codes
var HTTP_CREATE_FAILED = 400;
var HTTP_CREATE_SUCCEEDED = 201;
var HTTP_GET_FAILED = 404;
var HTTP_GET_SUCCEEDED = 200;

describe('Server', function () {

    before(function (done) {
        console.log("before");
        return database_utils.before(done);
    })
    after(function (done) {
        return database_utils.after(done);
    })

    describe('Test /registration service', function () {

        it('tests a valid registration', function (done) {
            hippie(server)
                .json()
                .post('/api/registration')
                .send({name: "Test User", email: "email@example.com"})
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .expectStatus(HTTP_CREATE_SUCCEEDED)
                .end(function (err, res, body) {
                    if (err) throw err;
                    done();
                });
        });

        it('tests an invalid registration (invalid email)', function (done) {
            hippie(server)
                .json()
                .post('/api/registration')
                .send({name: "Test User", email: "emailexample.com"})
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .expectStatus(HTTP_CREATE_FAILED)
                .end(function (err, res, body) {
                    if (err) throw err;
                    done();
                });
        });

    });

    describe('Test /users service', function () {

        it('tests a valid request', function (done) {
            hippie(server)
                .json()
                .get('/api/users/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IjU0ZDhkYmY0MmUxODljNTgyMTFhMzlkZSI.MfJI7g28-pO9rAiCBRlnezZVZ43Gp75LckHOZ6H5AY0')
                .expectStatus(HTTP_GET_SUCCEEDED)
                .end(function (err, res, body) {
                    if (err) throw err;
                    done();
                });
        });

        it('tests an invalid request (invalid token)', function (done) {
            hippie(server)
                .json()
                .get('/api/users/wrongtoken')
                .expectStatus(HTTP_GET_FAILED)
                .end(function (err, res, body) {
                    if (err) throw err;
                    done();
                });
        });

        it('tests an invalid request (missing token)', function (done) {
            hippie(server)
                .json()
                .get('/api/users')
                .expectStatus(HTTP_GET_FAILED)
                .end(function (err, res, body) {
                    if (err) throw err;
                    done();
                });
        });

    });
});