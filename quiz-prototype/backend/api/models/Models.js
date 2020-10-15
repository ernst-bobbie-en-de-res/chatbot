var mongoose = require('mongoose');

var User = new mongoose.Schema({
    name: String,
    address: String,
    town: String,
    emailAddress: String,
    answers: Array
});

var Answer = new mongoose.Schema({
    optionId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Option' },
    questionId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Question' }
});

var Option = new mongoose.Schema({
    categoryId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
    text: String
});

var Question = new mongoose.Schema({
    question: String,
    options: [Option]
});

var Category = new mongoose.Schema({
    name: String,
    description: String
});

module.exports = {
    User: mongoose.model('User', User),
    Answer: mongoose.model('Answer', Answer),
    Question: mongoose.model('Question', Question),
    Option: mongoose.model('Option', Option),
    Category: mongoose.model('Category', Category),
}; 