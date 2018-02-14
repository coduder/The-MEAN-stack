var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var Message = require('../models/messages');

// fetches all Messages from backend
router.get('/', function(req, res, next) {
    Message.find()
        .populate('user', 'firstName') // mongoose chained function, this expands the message model( ./models/messages.js) from holding simply a userId. it changes that parameter to hold a user object with the specified parameters in the 2nd argument, in this case, just adds firstname, so now messages have a User object with an _id and firstName property 
        .exec(function(err, messages) {
            if (err) {
                // 500 indicates a server error
                return res.status(500).json({
                    title: 'An Error Occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});

// this route acts as a backend protection, filtering all routes after initial load to ensure user is logged in
router.use('/', function(req, res, next) {
    // make the token stored on query params on front end, 1st argument is token, 2nd is the 'secret' string which must match the secret string where it was created, then a callback
    jwt.verify(req.query.token, 'secret', function(err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        next();
    });
});

// because this file is only reached with a URL path of /message/.. picture all of the below routes being preceded by message/
router.post('/', function(req, res, next) {
    var decoded = jwt.decode(req.query.token); // could user jwt.verify() here but because routes are protected by above router.use(), we can simply decode the token
    User.findById(decoded.user._id, function(err, user) {
        if (err) {
            // 500 indicates a server error
            return res.status(500).json({
                title: 'An Error Occurred',
                error: err
            });
        }
        var message = new Message({
            // assume the request body is sent with a field called "content"
            content: req.body.content,
            user: user._id
        });
        message.save(function(err, result) {
            if (err) {
                // 500 indicates a server error
                return res.status(500).json({
                    title: 'An Error Occurred',
                    error: err
                });
            }
            // push this message to this user's messages array and save that user
            user.messages.push(result);
            user.save();
            // 201 indicates no issues occurred
            res.status(201).json({
                message: 'Saved message',
                obj: result
            });
        });
    });

});

router.patch('/:id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token); // could user jwt.verify() here but because routes are protected by above router.use(), we can simply decode the token
    Message.findById(req.params.id, function(err, message) {
        if (err) {
            return res.status(500).json({
                title: 'An Error Occurred',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: { message: 'Message not found' }
            });
        }
        // ensure only user who own's this message can edit it
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: { message: "Users do not match" }
            });
        }
        message.content = req.body.content;
        message.save(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An Error Occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Saved Message',
                obj: result
            });
        });
    });
});

router.delete('/:id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token); // could user jwt.verify() here but because routes are protected by above router.use(), we can simply decode the token
    Message.findById(req.params.id, function(err, message) {
        if (err) {
            return res.status(500).json({
                title: 'An Error Occurred',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: { message: 'Message not found' }
            });
        }
        // ensure only user who own's this message can delete it
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: { message: 'Users do not match' }
            });
        }
        message.remove(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An Error Occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Deleted Message',
                obj: result
            });
        });
    });
});

module.exports = router;