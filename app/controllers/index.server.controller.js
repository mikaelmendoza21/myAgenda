exports.render = function(req, res) {
    res.render('index', {
        title: 'Test App',
        user: JSON.stringify(req.user)
    });
};