'use strict';

process.env.NODE_ENV = 'test';

var database_utils = require('../database_utils');
var should = require('should');
var userModel = require('../../model/user').userModel;

describe('User model', function () {

    describe('Email validation', function () {
        it('should be an invalid email', function (done) {
            var user = new userModel({name: "Test User", email: "invalidemailgmail.com"});

            user.save(function (err) {
                should.exist(err);
                done();
            });
        });
        it('should be a valid email', function (done) {
            var user = new userModel({name: "Test User", email: "validemail@gmail.com"});

            user.save(function (err) {
                should.not.exist(err);
                done();
            });
        });
    });
});