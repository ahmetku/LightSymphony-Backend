module.exports = userRoutes;

function userRoutes(passport) {

    var router = require('express').Router();
    var userController = require('./userController');

    router.post('/signup', userController.signup);
    router.post('/login', userController.login);
    router.post('/unregister', passport.authenticate('jwt', {session: false}),userController.unregister);
    router.post('/forgot', userController.postForgot);
    router.get('/reset/:token', userController.getReset);
    router.post('/reset/:token', userController.postReset);

    return router;

}