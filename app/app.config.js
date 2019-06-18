
var apiUrl = 'http://localhost:8000'

angular.
  module('App').
  config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider.
        when('/', {
          template: '<dashboard></dashboard>'
        })
        .otherwise('/')
    }
  ]);