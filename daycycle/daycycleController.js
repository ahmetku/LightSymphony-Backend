var Daycycle = require('./daycycleSchema');


// Create endpoint /api/daycycles for POST
exports.postDaycycle = function(req, res) {

    var daycycle = new Daycycle(req.body);
    console.log(req.body);

//    console.log(daycycle);

    //do not allow user to fake identity. The user who postet the movie must be the same user that is logged in
//    if (!req.user.equals(daycycle.user)) {
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