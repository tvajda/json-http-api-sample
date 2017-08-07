'use strict';

var database = require('mongoose');
var utils = require('../utils/utils');

var userSchema = new database.Schema({
  name: String,
  email: String
});

var UserModel = database.model('User', userSchema);

// validate email field
UserModel.schema.path('email').validate(function (email) {
  return utils.isValidEmail(email);
}, 'Invalid email');

module.exports = UserModel;
