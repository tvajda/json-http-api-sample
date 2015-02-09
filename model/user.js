var database = require('mongoose');
var utils = require('./../utils/utils');

var userSchema = new database.Schema({
    name: String,
    email: String
});

var userModel = database.model('User', userSchema);

//
// Validate email field
//
userModel.schema.path('email').validate(function (email) {
        return utils.validEmail(email);
    }, 'Invalid email'
);

exports.userModel = userModel;