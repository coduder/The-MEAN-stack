var express = require('express');
var router = express.Router();

var Message = require('../models/messages');

// fetches all Messages from backend
router.get('/', function(req, res, next) {
    Message.find()
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

// because this file is only reached with a URL path of /message/.. picture all of the below routes being preceded by message/
router.post('/', function(req, res, next) {
    var message = new Message({
        // assume the request body is sent with a field called "content"
        content: req.body.content,
    });
    message.save(function(err, result) {
        if (err) {
            // 500 indicates a server error
            return res.status(500).json({
                title: 'An Error Occurred',
                error: err
            });
        }
        // 201 indicates no issues occurred
        res.status(201).json({
            message: 'Saved message',
            obj: result
        });
    });
});

router.patch('/:id', function(req, res, next) {
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