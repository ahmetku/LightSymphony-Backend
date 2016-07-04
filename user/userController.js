var Config = require('../config/config.js');
var User = require('./userSchema');
var jwt = require('jwt-simple');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

module.exports.login = function (req, res) {

    if (!req.body.useremail) {
        res.status(400).send('username required');
        return;
    }
    if (!req.body.password) {
        res.status(400).send('password required');
        return;
    }

    User.findOne({useremail: req.body.useremail}, function (err, user) {
        if (err) {
            res.status(500).send(err);
            return
        }

        if (!user) {
            res.status(401).send('Invalid Credentials');
            return;
        }
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (!isMatch || err) {
                res.status(401).send('Invalid Credentials');
            } else {
                res.status(200).json({token: createToken(user)});
            }
        });
    });

};

module.exports.signup = function (req, res) {
    if (!req.body.useremail) {
        res.status(400).send('useremail required');
        return;
    }
    if (!req.body.password) {
        res.status(400).send('password required');
        return;
    }

    var user = new User();

    user.useremail = req.body.useremail;
    user.password = req.body.password;

    user.save(function (err) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(201).json({token: createToken(user)});
    });
};

module.exports.unregister = function (req, res) {
    req.user.remove().then(function (user) {
        res.sendStatus(200);
    }, function (err) {
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
    return jwt.encode(tokenPayload, Config.auth.jwtSecret);
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'ahmetk_53@hotmail.de',
        pass: '0816562485'
    }
});

module.exports.postForgot = function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({useremail: req.body.useremail}, function (err, user) {
                if (!user) {
                    // req.flash('error', 'No account with that email address exists.');
                    res.status(400).send('No account with that email address exists.');
                    return; // res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var mailOptions = {
                to: user.useremail,
                from: 'passwordreset@demo.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            transporter.sendMail(mailOptions, function (err) {
                res.status(201).send('An e-mail has been sent to ' + user.useremail + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        //res.redirect('/forgot');
    });
};

module.exports.getReset = function (req, res) {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function (err, user) {
        if (!user) {
            res.status(400).send('Password reset token is invalid or has expired.');
            return; // res.redirect('/forgot');
        }
        res.status(400).send('New Pwd please');
        return;
        /*    res.render('reset', {
         user: req.user
         });*/
    });
};

module.exports.postReset = function (req, res) {
    async.waterfall([
        function (done) {
            User.findOne({
                    resetPasswordToken: req.params.token,
                    resetPasswordExpires: {$gt: Date.now()}
                },
                function (err, user) {
                    if (!user) {
                        res.status(400).send('Password reset token is invalid or has expired postReset.');
                        return;// res.redirect('back');
                    }

                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function (err) {
                        req.logIn(user, function (err) {
                            done(err, user);
                        });
                    });
                });
        },
        function (user, done) {
            var mailOptions = {
                to: user.useremail,
                from: 'passwordreset@demo.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.useremail + ' has just been changed.\n'
            };
            transporter.sendMail(mailOptions, function (err) {
                res.status(400).send('Success! Your password has been changed.');
                done(err, 'done');
            });
        }
    ], function (err) {
        res.status(400).send('Success! Your password has been changed.');
        //res.redirect('/');
    });
};

