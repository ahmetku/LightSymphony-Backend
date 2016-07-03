var Daycycle = require('./daycycleSchema');
var User = require('../user/userSchema');
var randomString = require('randomstring');

// Create endpoint /api/daycycles for POST
exports.postDaycycle = function(req, res) {

 console.log("positng dayccle");
    //check if the user details are good
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
            console.log("Error finding user by email");
            res.status(500).send(err);

            return
        }

        if (!user) {
            console.log("Invalid Credentials. User not found");
            res.status(401).send('Invalid Credentials. User not found');
            return;
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if(!isMatch || err){
                console.log("Invalid Credentials. Password don't match");
                res.status(401).send("Invalid Credentials. Password don't match");
            } else {

                //save the daycycle
                var newDayCycle = new Daycycle();
                if(req.body.title)
                    newDayCycle.title = req.body.title;
                else{
                    console.log("missing title");
                    res.status(400).send("title was not provided");
                }

                if(req.body.configuration)
                    newDayCycle.configuration = req.body.configuration;
                else{
                    console.log("missing configuration");
                    res.status(400).send("configuration was not provided");
                }

                if(req.body.description)
                    newDayCycle.description = req.body.description;
                else{
                    console.log("missing description");
                    res.status(400).send("description was not provided");
                }

                if(req.body.maxmoonlight)
                    newDayCycle.maxmoonlight = req.body.maxmoonlight;

                newDayCycle.uniqueID = randomString.generate(6);
                newDayCycle.owner = user;

                newDayCycle.save(function(err, d) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }

                    res.status(201).json(d);
                });
            }
        });
    });
};

// Create endpoint /api/daycycles for GET
exports.getDaycycles = function(req, res) {
    Daycycle.find(function(err, daycycles) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(daycycles);
    });
};


// Create endpoint /api/daycycles/:daycycle_id for GET
exports.getDaycycle = function(req, res) {
    // Use the Beer model to find a specific beer
    Daycycle.findById(req.params.daycycle_id, function(err, daycycle) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(daycycle);
    });
};

// Create endpoint /api/daycycles/:daycycle_id for PUT
exports.putDaycycle = function(req, res) {
    // Use the Beer model to find a specific beer
    Daycycle.findByIdAndUpdate(
        req.params.daycycle_id,
        req.body,
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, daycycle) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(daycycle);
        });

};

// Create endpoint /api/daycycles/:daycycle_id for DELETE
exports.deleteDaycycle = function(req, res) {
    // Use the Beer model to find a specific beer and remove it
    Daycycle.findById(req.params.daycycle_id, function(err, d) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        //authorize
//        if (d.user && req.user.equals(d.user)) {
            d.remove();
            res.sendStatus(200);
  //      } else {
  //          res.sendStatus(401);
  //      }

    });
};


/*this will handle paraeterized url for get*/
/*GET channel congifuration listings*/
module.exports.createEmptyResponse = function(req, res, next)
{
    req.config = [];
    return next();
};

module.exports.sendAll = function(req, res, next){
    var title = req.query.title;
    var uniqueId = req.query.id;
    if(!title && !uniqueId)
    {
        Daycycle.find({})
            .exec(function (err, dayCycle) {
                if(err){
                    console.log('Error occured while serving all day-cycles');
                    console.error(err.stack);
                    var error= new Error("An error occured while processing this request."); //don't expose actual error
                    return next(error);

                }else{
                    console.log('Serving all day cycles');
                    dayCycle.forEach(function (item) {
                        req.config.push(item);
                    })

                    return next();
                }
            });
    }
    else if(title && uniqueId){
        Daycycle.findOne({
            "uniqueID":uniqueId
        }, function(err, dayCycle){
            if(err){
                console.log("Error occured while searching for day-cycles with uniqueID "+uniqueId);
                console.error(err.stack);
                var error= new Error("An error occured while processing this request."); //don't expose actual error
                return next(error);
            }else{
                console.log("Serving day-cycles with uniqueID "+uniqueId+ " and title"+title);
                if(dayCycle && dayCycle.title === title)
                    req.config.push(dayCycle);
                return next();
            }
        });
    }
    else if(uniqueId){
        Daycycle.findOne({
            "uniqueID":uniqueId
        }, function(err, dayCycle){
            if(err){
                console.log("Error occured while searching for day-cycles with uniqueID "+uniqueId);
                console.error(err.stack);
                var error= new Error("An error occured while processing this request."); //don't expose actual error
                return next(error);
            }else{
                console.log("Serving day-cycles with uniqueID "+uniqueId);
                if(dayCycle)
                    req.config.push(dayCycle);
                return next();
            }
        });
    }
    else if(title){
        Daycycle.find({
            "title": {"$regex": title, "$options": "i"}
        }, function (err, dayCycle) {
            if(err){
                console.log("Error occured while searching for day-cycles with "+title +" in their title");
                console.error(err.stack);
                var error= new Error("An error occured while processing this request."); //don't expose actual error
                next(error);
            }else{
                console.log("Serving day-cycles with "+title +" in their title");
                dayCycle.forEach(function (item) {
                    console.log(item);
                    req.config.push(item);
                })
                return next();
            }
        });
    }
};

module.exports.returnCollectedConfig = function(req, res){
    res.json(req.config);
};