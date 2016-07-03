var Daycycle = require('./daycycleSchema');


// Create endpoint /api/daycycles for POST
exports.postDaycycle = function(req, res) {

    var daycycle = new Daycycle(req.body);

    //do not allow user to fake identity. The user who postet the daycylce must be the same user that is logged in
//    if (!req.user.equals(daycycle.owner)) {
//        res.sendStatus(401);
//    }
    daycycle.save(function(err, d) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(201).json(d);
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