module.exports = app => {
    var controller = require('../controllers/UserController');

    app.route('/users')
        .get(controller.getAll)
        .post(controller.createOne);

    app.route('/users/:id')
        .get(controller.getOne);
}; 