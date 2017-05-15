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
    console.log("Event created");
    res.json("Event Successfully created");
};

//return the Event's info
exports.eventByID = function(req, res, next, id) {
    var currentUser = req.user;
    console.log("Update Event with id:"+ id);
    console.log("Current User=" +JSON.stringify(currentUser.username));
    User.findOne({"id": currentUser.id},
        {$elementMatch:{"events.$.id": id}},   //fetch only the single event
        function(err,event){
            if(err){
                console.log(err);
            }
            req.event = event;
            next();
    });
};

exports.update = function(req, res) {
    console.log("event.server.controller updating Event");
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