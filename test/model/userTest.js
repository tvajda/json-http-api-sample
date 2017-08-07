'use strict';

process.env.NODE_ENV = 'test';

var should = require('should');

var UserModel = require('../../model/user');

describe('User model', function () {

  describe('Email validation', function () {

    it('should be an invalid email', function (done) {
      var user = new UserModel({name: 'Test User', email: 'invalidemailgmail.com'});

      user.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be a valid email', function (done) {
      var user = new UserModel({name: 'Test User', email: 'validemail@gmail.com'});

      user.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
  });
});