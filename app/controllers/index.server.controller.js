exports.render = function(req, res) {
    res.render('index', {
        title: 'myAgenda',
        user: req.user ? req.user.username : ''
        //user: JSON.stringify(req.user)
    });
};