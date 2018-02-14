var mongoose = require('mongoose');
var User = require('./user');
var Schema = mongoose.Schema;

// blueprint of message
var schema = new Schema({
    content: { type: String, required: true }, // mongoose recognizes type and required
    user: { type: Schema.Types.ObjectId, ref: 'User' } // internal id mongoose uses to identify individual objects, ref: indicates the model to use (e.g. User)
});

// post here means 'after' thus anytime a message is 'removed' this funciton executes afterwords
schema.post('remove', function(message) {
    User.findById(message.user, function(err, user) {
        user.messages.pull(message._id);
        user.save();
    });
});

// this indicates a model type of Message   therefore you can create a new Message() << like this
// also creates a collection named messages (lowercase and plural)
// 2nd argument specifies the blueprint for our message (defined for us by schema)
module.exports = mongoose.model('Message', schema);