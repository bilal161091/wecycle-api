var restify = require('restify');
var app = restify.createServer();
var mongoose = require('mongoose');
var http = require('http');
var Schema = mongoose.Schema;


app
    .use(restify.fullResponse())
    .use(restify.bodyParser());


//connection to mongodb
mongoose.connect('mongodb://heroku_app33373738:k0cja96r943p0h5p5rdbjok3sn@ds033831.mongolab.com:33831/heroku_app33373738');


//Models for database
var User = mongoose.model('User', {
    _id: Number,
    email: String,
    password: String,
    phone_number: String,
    name: String,
    items: [{type: Schema.Types.ObjectId, ref: 'Item'}]
});

var Item = mongoose.model('Item', {
    _creator:{type: Schema.Types.ObjectId, ref: 'User'},
    name: String,
    description: String,
    url: [String]
});



//default route
app.get('/', function(req, res) {
    res.send('default route');
});



//get users
app.get('/users', function(req, res){
    var query = User.where({});
    query.find(function (err, users){
        res.send(users);
    });
});

app.get('/users/:user_id', function(req, res){
    var query = User.where({_id: req.params._id});
    query.find(function (err, users){
        res.send(users);
    });
});


app.get('/Users/items', function (req, res) {
    Item.find({_creator: req.params._id}).populate('items').populate('users').exec(function (err, item) {
        console.log(item);
    });
});


//post users
app.post('/users', function(req, res){
    //console.log("Params: " + req.params.email + "");
    var user = new User({
        _id:req.params._id,
        email: req.params.email,
        password: req.params.password,
        phone_number: req.params.phone_number,
        name: req.params.name
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


/**
 * Items
 */

//get items
app.get('/items', function(req, res) {
    var query = Item.where({});
    query.find(function (err, items) {
        res.send(items);
    });
});

app.get('/items/:item_id', function(req, res){
    var query = Item.where({_id: req.params.item_id});
    query.find(function (err, items){
        res.send(items);
    });
});





//post items
app.post('/items', function(req, res){

    if (req.params.name == undefined || req.params.name == "") {
        res.status(404);
        res.send({
            message:" No name defined "
        });
    }

    if (req.params._creator == undefined || req.params._creator == "") {
        res.status(404);
        res.send({
           message:" Please give name and contact details "
        });
    }

    if (req.params.url == undefined || req.params.url == "") {
        res.status(404);
        res.send({
            message:"Please give url of photos of items"
        });
    }


    var item = new Item({
        name: req.params.name,
        description: req.params.description,
        url: req.params.url.split(", "),
        _creator: User._id
    });


    item.save(function (err, newItem) {
        if (err) {
            res.status(404);
            console.error(err);
            res.send({
                message: "Something went wrong"
            })
        } else {
            res.status(200);
            res.send({
                message: "item successfully added"
            })
        }
    });
});

//update item
app.put('/items/:item_id', function (req, res){
  Item.findById(req.params.item_id, function (err, item) {
      console.log(req.body.name);

      var data = JSON.parse(req.body);
      item.name = data.name;
      item.description = data.description;
      item.url = data.url;
      item._creator = data._creator;

      if(item._creator != User._id){
          res.status(404);
          res.send({
              message: "Please enter the correct username"
          })
      }

      item.save(function (err) {
          if (!err) {
              console.log("updated successfully");
              res.status(200);
              res.send({
                  message: "updated successfully"
              })
          } else {
              console.log(err);
          }
          res.send(item);
      });
  });
});

//delete item
app.del('/items/:item_id', function (req, res) {

    var query = Item.where({_id: req.params.item_id});
    query.remove(function (err, items) {
        if(err){
            res.status(404);
            res.send({
                message:"item not deleted"
            });
        } else {
            res.status(200);
            res.send({
                message:"item deleted"
            });
        }
    });
});


//listening @ localhost port
app.listen((process.env.PORT || 5000), function() {
    console.log("Node app is running at localhost");
});
