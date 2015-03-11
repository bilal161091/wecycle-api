//tesing github client

var restify = require('restify');
var app = restify.createServer();
var mongoose = require('mongoose');
var http = require('http');


app
    .use(restify.fullResponse())
    .use(restify.bodyParser());

//connection to mongodb
mongoose.connect('mongodb://heroku_app33373738:k0cja96r943p0h5p5rdbjok3sn@ds033831.mongolab.com:33831/heroku_app33373738');

app.get('/', function(req, res) {
    res.send('default route');
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

var User = mongoose.model('User', {
    email: String,
    password: String
});

var Item = mongoose.model('Item', {
    name: String,
    description: String
});




//post users
app.post('/users', function(req, res){
    console.log("Params: " + req.params.email + "");
    var user = new User({
        email: req.params.email,
        password: req.params.password
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
    console.log("Params: " + req.params.name + "");
    var item = new Item({
        name: req.params.name,
        description: req.params.description
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