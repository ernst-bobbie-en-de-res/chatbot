module.exports = app => {
    var controller = require('../controllers/QuestionController');

    app.route('/questions')
        .get(controller.getAll);
}; 