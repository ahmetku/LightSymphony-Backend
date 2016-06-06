module.exports = daycycleRoutes;


function daycycleRoutes(passport) {

    var daycycleController = require('./daycycleController');
    var router = require('express').Router();
    var unless = require('express-unless');

    //var mw = passport.authenticate('jwt', {session: false});
    //mw.unless = unless;

    //middleware
    //router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.route('/daycycles')
        .post(daycycleController.postDaycycle)
        .get(daycycleController.getDaycycles);

    router.route('/daycycles/:daycycles_id')
        .get(daycycleController.getDaycycle)
        .put(daycycleController.putDaycycle)
        .delete(daycycleController.deleteDaycycle);

    return router;
}