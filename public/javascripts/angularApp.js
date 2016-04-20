var app = angular.module('awesomeBoard', ['ui.router']);

app
.factory('teams', ['$http', function($http) {
    var o = {
        teams: []
    };

    o.get = function(id) {
        return $http.get('/teams/' + id).then(function(res) {
            return res.data;
        });
    };

    o.getAll = function() {
        return $http.get('/teams').then(function(res) {
            angular.copy(res.data, o.teams);
        });
    };

    o.create = function(team) {
        return $http.post('/teams', team).then(function(res) {
            o.teams.push(res.data);
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
])
.controller('TeamsCtrl', [
    '$scope',
    'teams',
    'team',
    function($scope, teams, team) {
        $scope.team = team;
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
    })
    .state('teams', {
        url: '/teams/{id}',
        templateUrl: '/teams.html',
        controller: 'TeamsCtrl',
        resolve: {
            team: ['$stateParams', 'teams', function($stateParams, teams) {
                return teams.get($stateParams.id);
            }]
        }
    });

    $urlRouterProvider.otherwise('home');
}]);