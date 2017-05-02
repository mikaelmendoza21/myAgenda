exports.render = function(req, res) {
    res.render('index', {
        title: 'myAgenda',
        user: JSON.stringify(req.user)
    });
};