module.exports = daycycleRoutes;


function daycycleRoutes(passport) {

    var daycycleController = require('./daycycleController');
    /*var daycycleControllerV2={
        createEmptyResponse : require('./daycycleController').createEmptyResponse,
        sendAll : require('./daycycleController').sendAll,
        returnCollectedConfig : require('./daycycleController').returnCollectedConfig
    }*/
    var router = require('express').Router();
    var unless = require('express-unless');

    //var mw = passport.authenticate('jwt', {session: false});
    //mw.unless = unless;

    //middleware
    //router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.get('/day-cycle', daycycleController.createEmptyResponse, daycycleController.sendAll, daycycleController.returnCollectedConfig);

    router.route('/daycycles')
        .post(daycycleController.postDaycycle)
        .get(daycycleController.getDaycycles);

    router.route('/daycycles/:daycycles_id')
        .get(daycycleController.getDaycycle)
        .put(daycycleController.putDaycycle)
        .delete(daycycleController.deleteDaycycle);

    return router;
}