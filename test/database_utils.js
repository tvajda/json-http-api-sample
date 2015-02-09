'use strict';

var mongoose = require('mongoose');

function before(done) {

    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function () {
            });
        }
        return done();
    }

    clearDB();
};

function after(done) {
    return done();
};

exports.before = before;
exports.after = after;