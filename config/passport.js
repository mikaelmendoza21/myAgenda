var passport = require('passport'),
    mongoose = require('mongoose');

module.exports = function() {
    var User = mongoose.model('User');

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne(   //fetch the User info from Db
            {_id: id},
            '-password',    //do NOT fetch the password field
            function(err, user) {
                done(err, user);
            }
        );
    });

    require('./strategies/local.js')();
};