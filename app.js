var restify = require('restify');
var app = restify.createServer();
var mongoose = require('mongoose');
var http = require('http');
var Schema = mongoose.Schema;
require('./routes')(app);

app
    .use(restify.fullResponse())
    .use(restify.bodyParser());


//connection to mongodb
mongoose.connect('mongodb://heroku_app33373738:k0cja96r943p0h5p5rdbjok3sn@ds033831.mongolab.com:33831/heroku_app33373738');


//Models for database
var User = mongoose.model('User', {
    // _id: Number,
    email: String,
    password: String,
    phone_number: String,
    name: String
    // items: [{type: Schema.Types.ObjectId, ref: 'Item'}]
});

var Item = mongoose.model('Item', {
    _creator:{type: Schema.Types.ObjectId, ref: 'User'},
    name: String,
    description: String,
    url: [String]
});




//listening @ localhost port
app.listen((process.env.PORT || 5000), function() {
    console.log("Node app is running at localhost");
});
