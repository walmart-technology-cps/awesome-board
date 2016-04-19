var app = angular.module('awesomeBoard', ['ui.router']);

app
.factory('teams', ['$http', function($http) {
    var o = {
        teams: []
    };

    o.getAll = function() {
        return $http.get('/teams').success(function(data) {
            angular.copy(data, o.teams);
        });
    };

    o.create = function(team) {
        return $http.post('/teams', team).success(function(data) {
            o.teams.push(data);
        });
    };

  return o;
}]);

app
.controller('MainCtrl', [
    '$scope',
    'teams',
    function($scope, teams) {
        $scope.teams = teams.teams;

        $scope.addTeam = function() {
            if(!$scope.teamName || $scope.teamName === '') {
                return;
            }
            teams.create({
                name: $scope.teamName
            });
            $scope.teamName = '';
        };
    }
]);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
            postPromise: ['teams', function(teams) {
                return teams.getAll();
            }]
        }
    });

    $urlRouterProvider.otherwise('home');
}]);