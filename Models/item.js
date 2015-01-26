var mongoose = require('mongoose');
var Schema = mongoose.schema;

var itemSchema = new Schema({
    name: String,
    description: String
});

mongoose.model('item', itemSchema);