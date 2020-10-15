var express = require('express'),
    mongoose = require('mongoose'),
    app = express(),
    port = process.env.PORT || 3001,
    bodyParser = require('body-parser'),
    Models = require('./api/models/Models');

//Middleware Setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Mongoose Setup
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://test:test123@minor-project.jqmob.mongodb.net/quizzer?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

//Register Routes
var registerUserRoutes = require('./api/routes/UserRoutes'),
    registerQuestionRoutes = require('./api/routes/QuestionRoutes');
registerUserRoutes(app);
registerQuestionRoutes(app);

app.listen(port, () => console.log(`The server has started on localhost:${port}`)); 