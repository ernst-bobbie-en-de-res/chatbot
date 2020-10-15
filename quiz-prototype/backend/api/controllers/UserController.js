var mongoose = require('mongoose'),
    Models = require('../models/Models');

exports.getAll = (req, res) => {
    Models.User.find({}, function (err, obj) {
        if (err)
            res.send(err);
        res.json(obj);
    });
};

exports.getOne = (req, res) => {
    Models.User.findById(req.params.id, function (err, obj) {
        if (err)
            res.send(err);
        res.json(obj);
    });
};

exports.createOne = async (req, res) => {
    await Models.User.find({ emailAddress: req.body.emailAddress }, async (err, obj) => {
        if (err)
            return res.send(err);
        if (obj === null || obj === undefined || obj.length > 0)
            return res.status(500).json({ error: `There is already a user with the emailaddress ${req.body.emailAddress}` });

        var user = new Models.User(req.body);
        await user.save((err, obj) => {
            if (err)
                return res.status(500).send(err);
            return res.status(200).json(obj);
        });
    });
};