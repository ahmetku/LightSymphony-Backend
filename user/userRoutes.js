module.exports = userRoutes;

function userRoutes(passport) {

    var userController = require('./userController');
    var router = require('express').Router();


    router.post('/login', userController.login);
    router.post('/signup', userController.signup);

    return router;

}