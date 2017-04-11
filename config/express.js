//modules & config required by Express
var config = require('./config');
var bodyParser = require('body-parser');
var express = require('express');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');


module.exports = function() {
    var app = express();

    //body-parser settings to receive json POST data
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    //use a Express-Session
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'OurSuperSecretCookieSecret'
    }));

    //View settings, EJS as renderer
    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    //use flash messages
    app.use(flash());

    //use this code before any route definitions
    app.use(passport.initialize());
    app.use(passport.session());

	//Routes
    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/user.server.routes.js')(app);

    //Using static files
    app.use(express.static('./public'));
    return app;
};
