/*
    Module dependencies
*/

var restify = require('restify');
var app = restify.createServer();
var mongoose = require('mongoose');
var http = require('http');
var restifyRoutes = require('restify-routes');
var fs = require('fs-extra');

mongoose.connect('mongodb://heroku_app33373738:k0cja96r943p0h5p5rdbjok3sn@ds033831.mongolab.com:33831/heroku_app33373738');

app.get('/', function(req, res) {
    res.send('default route');
});

fs.readdirSync(__dirname + '/Models').forEach(function(filename){
    if(~filename.indexOf('.js')) require(__dirname + '/Models/' + filename);
});


app.get('/items', function(req, res) {
    var query = Item.where({});
    query.find(function (err, items) {
        res.send(items);
    });
});

app.get('/users', function(req, res){
    var query = User.where({});
    query.find(function (err, users){
        res.send(users);
    });
});



/*
var User = mongoose.model('User', {
    email: String,
    password: String
});

var Item = mongoose.model('Item', {
    name: String,
    description: String
});
*/






//post users
app.post('/users', function(req, res){
    console.log("Params: " + req.body.email + "");
    var user = new User({
        email: req.body.email,
        password: req.body.password
    });

    console.log("About to save user");
    user.save(function (err, newUser) {
        if (err)
            return console.error(err);
        res.send({
            message: "User successfully added"
        });
    });
});

//post items
app.post('/items', function(req, res){
    console.log("Params: " + req.body.name + "");
    var item = new Item({
        name: req.body.name,
        description: req.body.description
    });

    console.log("About to save item");
    item.save(function (err, newItem) {
        if (err)
            return console.error(err);
        res.send({
            message: "item successfully added"
        });
    });
});

//listening @ localhost port
app.listen((process.env.PORT || 5000), function() {
    console.log("Node app is running at localhost");
});