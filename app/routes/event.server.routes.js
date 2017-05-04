var users = require('../../app/controllers/user.server.controller'),
    events = require('../../app/controllers/event.server.controller');

module.exports = function(app) {
    app.route('/api/events')
        .get(events.list)
        .post(users.requiresLogin, events.create);

    app.route('/api/events/:eventId')
        .get(events.read)
        .put(users.requiresLogin, events.hasAuthorization, events.update)
        .delete(users.requiresLogin, events.hasAuthorization, events.delete);

    app.param('eventId', events.eventByID);
};