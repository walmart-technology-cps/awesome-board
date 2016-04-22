var app = angular.module('awesomeBoard', ['ui.router']);

app
.factory('teams', ['$http', function($http) {
    var o = {
        teams: [],
        boards: [],
        team: {},
        board: {}
    };

    o.get = function(id) {
        return $http.get('/teams/' + id).then(function(res) {
            return res.data;
        });
    };

    o.getAll = function() {
        return $http.get('/teams').then(function(res) {
            angular.copy(res.data, o.teams);
            return res.data;
        });
    };

    o.create = function(team) {
        return $http.post('/teams', team).then(function(res) {
            o.teams.push(res.data);
            angular.copy(res.data, o.team);
            return res.data;
        });
    };

    o.addBoard = function(teamId, board) {
      return $http.post('/teams/' + teamId + '/boards', board).then(function(res) {
        angular.copy(res.data, o.board);
        return res.data;
      });
    };

    o.getBoards = function(teamId) {
      return $http.get('/teams/' + teamId + '/boards').then(function(res) {
        angular.copy(res.data, o.boards);
        return res.data;
      });
    };

  return o;
}]);

app
.controller('MainCtrl', [
    '$scope',
    '$filter',
    'teams',
    function($scope, $filter, teams) {
        $scope.teams = teams.teams;
        $scope.boards = teams.boards;
        $scope.team = {};
        $scope.board = {};
        $scope.data = {
          teamSelect: '',
          boardSelect: ''
        };

        $scope.addTeam = function() {
            if(!$scope.teamName || $scope.teamName === '') {
                return;
            }
            teams.create({
                name: $scope.teamName
            });
            $scope.team = teams.team;
            $scope.teamName = '';
            $scope.data.teamSelect = $scope.team._id;
        };

        $scope.addBoard = function() {
            if(!$scope.team || $scope.data.teamSelect === '' || !$scope.boardName || $scope.boardName === '') {
                return;
            }
            var board = {
              name: $scope.boardName
            };
            teams.addBoard($scope.data.teamSelect, board);
            $scope.board = teams.board;
            $scope.boardName = '';
            teams.getBoards($scope.data.teamSelect);
            $scope.boards = teams.boards;
            $scope.data.boardSelect = $scope.board._id;
        };

        $scope.getTeam = function() {
          if($scope.data.teamSelect === '') {
            $scope.team = null;
            $scope.board = null;
            $scope.boards = [];
            $scope.data.boardSelect = '';
            return;
          }
          $scope.team = teams.get($scope.data.teamSelect);
          teams.getBoards($scope.data.teamSelect);
          $scope.boards = teams.boards;
          $scope.data.boardSelect = '';
        };

        $scope.getBoard = function() {
          if($scope.data.boardSelect === '') {
            return;
          }
          $scope.board = $filter('filter')($scope.boards, {_id:$scope.data.boardSelect})[0];
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