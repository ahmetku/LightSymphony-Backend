var Config = require('./config/config.js');

/**
 * db connect
 */

var mongoose = require('mongoose');
var dump = require('./dump/dump');

var connection = mongoose.connect([Config.db.host, '/', Config.db.name].join(''),{
    //eventually it's a good idea to make this secure
    user: Config.db.user,
    pass: Config.db.pass
});

mongoose.connection.on('open', function(){
    connection.connection.db.dropDatabase(function(err, result){
        dump.create();
    });
});

/**
 * create application
 */

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

/**
 * app setup
 */

app.use(express.static(__dirname + "/frontend"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//passport

var passport = require('passport');
var jwtConfig = require('./passport/jwtConfig');

app.use(passport.initialize());
jwtConfig(passport);


/**
 * routing
 */

var userRoutes = require("./user/userRoutes");
var daycycleRoutes = require("./daycycle/daycycleRoutes");

app.use('/api', daycycleRoutes(passport));
app.use('/', userRoutes(passport));

module.exports = app;