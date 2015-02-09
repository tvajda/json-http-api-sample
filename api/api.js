var userModel = require('./../model/user').userModel;

// token coding/decoding
var jwt = require('jwt-simple');
var SECRET_KEY = 'json-api-sample-secret-key';

// config constants
var config = require('config');
var EMAIL_FROM_ADDRESS = config.get('email.from_address');
var EMAIL_SUBJECT = config.get('email.subject');

// HTTP codes
var HTTP_CREATE_FAILED = 400;
var HTTP_CREATE_SUCCEEDED = 201;
var HTTP_GET_FAILED = 404;
var HTTP_GET_SUCCEEDED = 200;

function api(server, emailTransporter) {

    server.post('/api/registration', function (req, res) {
        var name = req.params.name;
        var email = req.params.email;

        var user = new userModel({name: name, email: email});
        //
        // Store user to the database
        //
        user.save(function (err) {
            if (err) {
                console.log(err);
                res.send(HTTP_CREATE_FAILED, err);
            } else {
                var token = jwt.encode(user._id, SECRET_KEY);
                var url = constructUserURL(server, token);
                //
                // Send user notification email
                //
                if (emailTransporter) {
                    sendEmail(emailTransporter);
                }
                //
                // Compose response
                //
                res.setHeader("Location", url);
                var jsonUser = JSON.stringify(user);
                res.send(HTTP_CREATE_SUCCEEDED, jsonUser);
            }
        })
    });

    server.get('/api/users/:token', function (req, res) {
        var token = req.params.token;

        try {
            var userId = jwt.decode(token, SECRET_KEY);
            //
            // Lookup user in the database by ID decoded from the token
            //
            userModel.findById(userId, function (err, user) {
                if (err) {
                    console.log(err);
                    res.send(HTTP_GET_FAILED);
                } else {
                    //
                    // Retrieve list of all users in the database
                    //
                    userModel.find(function (err, users) {
                        if (err) {
                            console.log(err);
                            res.send(HTTP_GET_FAILED);
                        } else {
                            //
                            // Return list of all users
                            //
                            var jsonUsers = JSON.stringify(users);
                            res.send(HTTP_GET_SUCCEEDED, jsonUsers);
                        }
                    });
                }
            });
        } catch (err) {         // invalid token
            console.log(err);
            res.send(HTTP_GET_FAILED);
        }

    });
}

function constructUserURL(server, token) {
    return server.url + "/api/users/" + token;
};

function sendEmail(emailtransporter) {
    emailTransporter.sendMail({
        from: EMAIL_FROM_ADDRESS,
        to: user.email,
        subject: EMAIL_SUBJECT,
        text: url
    });
}

module.exports = api;
