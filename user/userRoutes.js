module.exports = userRoutes;

function userRoutes(passport) {

    var router = require('express').Router();
    var userController = require('./userController');
    var mw = passport.authenticate('jwt', {session: false});

    router.post('/signup', userController.signup);
    router.post('/login', userController.login);
    router.post('/unregister', mw, userController.unregister);
    router.post('/forgot', userController.postForgot);
    router.get('/reset/:token', userController.getReset);
    router.post('/reset/:token', userController.postReset);

    return router;

}