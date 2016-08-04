var express = require('express');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;

var MONGOLAB_URI = 'mongodb://outerlimits:mercy@ds015713.mlab.com:15713/reaction';
var uristring = 'mongodb://localhost:27017/maps';
mongoose.connect(MONGOLAB_URI, function() {
    console.log('Mongoose connected to your soul');

var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var User = require('./backend/model.js');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//endpoints 
app.get('/getListings', function(req, res) {
    var query = User.find({});
    query.exec(function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
});

app.post('/postListing', function(req, res) {
    var newuser = new User(req.body);
    newuser.save(function(err) {
        if (err)
            res.status(501).send('Error with your submission');
        res.status(200).json(req.body);
    });
});

app.listen(port, function() {
    console.log('Using the port:', port);
})
