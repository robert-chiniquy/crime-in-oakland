'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/maps', {templateUrl: 'partials/maps.html', controller: 'Maps'});
    $routeProvider.when('/graphs', {templateUrl: 'partials/graphs.html', controller: 'Graphs'});
    $routeProvider.otherwise({redirectTo: '/graphs'});
  }]);
