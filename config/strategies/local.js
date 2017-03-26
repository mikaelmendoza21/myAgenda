var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy, //Load LocalStrategy object
    User = require('mongoose').model('User');   //require the User model

module.exports = function() {
    passport.use(new LocalStrategy(function(username, password, done) {
        User.findOne(
            {username: username},   //find a User in Db matching the parameters

            function(err, user) {
                if (err) {  //error while querying Db
                    return done(err);
                }

                if (!user) {    //No matching user found in Db
                    return done(null, false, {message: 'Unknown user'});
                }

                if (!user.authenticate(password)) { //Wrong Password
                    return done(null, false, {message: 'Invalid password'});
                }

                //User properly authenticated, return info
                return done(null, user);
            }
        );
    }));
};