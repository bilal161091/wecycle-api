var mongoose = require('mongoose');
var Schema = mongoose.schema;

var userSchema = new Schema({
    email: String,
    password: String
});

mongoose.model('users', userSchema);