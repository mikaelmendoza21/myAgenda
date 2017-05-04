var User = require('mongoose').model('User'),
    Event = require('mongoose').model('Event'),
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

//Create and save a User
exports.create = function(req, res, next) {
    var user = new User(req.body);
    user.save(function(err) {
        if (err) {
            return next(getErrorMessage(err));
        } 
        else {
            res.json(user);
        }
    });
};

//Read a User object (convert to JSON)
exports.read = function(req, res) {
    res.json(req.user);
};

//Update User
exports.update = function(req, res, next) {
    User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
        if (err) {
            return next(err);
        } 
        else {
            res.json(user);
        }
    });
};

//Find user by ID
exports.userByID = function(req, res, next, id) {
    User.findOne({_id: id }, 
                function(err, user) {
                    if (err) {
                        return next(err);
                    } else {
                        req.user = user;
                        next();
                    }
                });
};

//Update single User by Id
exports.update = function(req, res, next) {
    User.findByIdAndUpdate(req.user.id, req.body, 
        function(err, user) {
            if (err) {
                    return next(err);
            } else {
            res.json(user);
            }
        });
};

exports.addEvent = function(req, res, next){
    console.log("adding events for "+ req.user);
    user.events.push(req.body);
}

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
    if(!req.user){
        return res.redirect('/login');
    }
    res.render('home', {
        title: app_title,
        messages: req.flash('error'),
        user: req.user
    });
};


//Performs the Registration routine
exports.register = function(req, res, next) {
    if (!req.user) {
        var user = new User(req.body);
        var defaultEvent = new Event({
            "title":"New Event",
            "date": Date.now
        });
        user.events= [defaultEvent];
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

//check that User if Logged In
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }
    next();
};