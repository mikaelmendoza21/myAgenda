var User = require('mongoose').model('User'),
    passport = require('passport');

var app_title = 'myAgenda';

//Error-handling for regitering a new User
var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    }
    else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }

    return message;
};

//calls the Log In page
exports.renderLogin = function(req, res, next) {
    if (!req.user) {
        res.render('login', {
            title: app_title,
            messages: req.flash('error') || req.flash('info')
        });
    }
    else {
        return res.redirect('/home');
    }
};

//calls the Regiter page
exports.renderRegister = function(req, res, next) {
    if (!req.user) {
        res.render('register', {
            title: app_title,
            messages: req.flash('error')
        });
    }
    else {
        return res.redirect('/home');
    }
};

exports.renderHome = function(req, res, next) {
    console.log("User data: "+ JSON.stringify(req.user));
    
    res.render('home', {
        title: app_title,
        messages: req.flash('error'),
        user: JSON.stringify(req.user)
    });
};


//Performs the Registration routine
exports.register = function(req, res, next) {
    if (!req.user) {
        var user = new User(req.body);
        var message = null;
        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/register');
            }

            req.login(user, function(err) {
                if (err)
                    return next(err);

                return res.redirect('/home');
            });
        });
    }
    else {
        return res.redirect('/home');
    }
};

//Log out and go back to index
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};