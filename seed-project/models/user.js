var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

// blueprint of message
var schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // unique is recognized but NOT validated automatically thus (npm install --save mongoose-unique-validator)
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }] // internal id mongoose uses to identify individual objects, ref: indicates the model to use (e.g. Message)
});

schema.plugin(mongooseUniqueValidator);

// this indicates a model type of User   therefore you can create a new User() << like this
// also creates a collection named users (lowercase and plural)
// 2nd argument specifies the blueprint for our user (defined for us by schema)
module.exports = mongoose.model('User', schema);