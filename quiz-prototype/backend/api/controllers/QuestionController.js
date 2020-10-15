var mongoose = require('mongoose'),
    Models = require('../models/Models');

exports.getAll = (req, res) => {
    Models.Question.find({}, function (err, obj) {
        if (err)
            res.send(err);
        res.json(obj);
    });
};