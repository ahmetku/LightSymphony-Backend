var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");

    $http.get('http://localhost:3000/api/daycycles').success(function(response) {
        $scope.daycycles = response;
    })

}]);﻿