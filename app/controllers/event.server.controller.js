var mongoose = require('mongoose'),
    Event = mongoose.model('Event'),
    User= mongoose.model('User'),
    userMethods = require('../../app/controllers/user.server.controller');

var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};

exports.create = function(req, res) {
    var currentUser = new User(req.user);
    var event = new Event(req.body);

    //Add event to User's events[]
    User.findByIdAndUpdate(
        currentUser.id,
        {$push:{"events": event}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            console.log(err);
        }
        );

    event.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(event);
        }
    });
};

exports.list = function(req, res) {
    var currentUser = new User(req.user);
    User.find({"id":currentUser.id}, 'events', function(err, events) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(events);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.event);
};

exports.eventByID = function(req, res, next, id) {
    Event.findById(id).populate('creator', 'name username').exec(function(err, event) {
        if (err)
            return next(err);

        if (!event)
            return next(new Error('Failed to load event ' + id));

        req.event = event;
        next();
    });
};

exports.update = function(req, res) {
    var event = req.event;
    event.title = req.body.title;
    event.comment = req.body.comment;
    event.date = req.body.date;
    event.completed = req.body.completed;
    event.creator = req.user;

    var currentUser = new User(req.user);
    //Add event to User's events[]
    User.findByIdAndUpdate(
        currentUser.id,
        {$push:{"events": event}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            console.log(err);
        }
        );

    event.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(event);
        }
    });
};

exports.delete = function(req, res) {
    var event = req.event;
    event.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(event);
        }
    });
};

exports.hasAuthorization = function(req, res, next) {
    if (req.event.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};