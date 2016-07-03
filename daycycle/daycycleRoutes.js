module.exports = daycycleRoutes;


function daycycleRoutes(passport) {

    var daycycleController = require('./daycycleController');
    var router = require('express').Router();
    var unless = require('express-unless');

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