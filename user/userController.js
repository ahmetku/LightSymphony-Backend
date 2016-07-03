var Config = require('../config/config.js');
var User = require('./userSchema');
var jwt = require('jwt-simple');

module.exports.login = function(req, res){

    if(!req.body.useremail){
        res.status(400).send('useremail required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }

    User.findOne({useremail: req.body.useremail}, function(err, user){
        if (err) {
            res.status(500).send(err);
            return
        }

        if (!user) {
            res.status(401).send('Invalid Credentials');
            return;
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if(!isMatch || err){
                res.status(401).send('Invalid Credentials');
            } else {
                res.status(200).json({token: createToken(user)});
            }
        });
    });

};

module.exports.signup = function(req, res){
    if(!req.body.useremail){
        res.status(400).send('useremail required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }

    var user = new User();

    user.useremail = req.body.useremail;
    user.password = req.body.password;

    user.save(function(err) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(201).json({token: createToken(user)});
    });
};

module.exports.unregister = function(req, res) {
    req.user.remove().then(function (user) {
        res.sendStatus(200);
    }, function(err){
        res.status(500).send(err);
    });
};

function createToken(user) {
    var tokenPayload = {
        user: {
            _id: user._id,
            useremail: user.useremail
        }

    };
    return jwt.encode(tokenPayload,Config.auth.jwtSecret);
};