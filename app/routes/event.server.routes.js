var users = require('../../app/controllers/users.server.controller'),
    events = require('../../app/controllers/event.server.controller');

module.exports = function(app) {
    app.route('/api/event')
        .get(events.list)
        .post(users.requiresLogin, event.create);

    app.route('/api/event/:eventId')
        .get(events.read)
        .put(users.requiresLogin, events.hasAuthorization, events.update)
        .delete(users.requiresLogin, events.hasAuthorization, events.delete);

    app.param('eventId', events.eventByID);
};