var app = angular.module('awesomeBoard', ['ui.router']);
var env = 'development';

app
.factory('teams', ['$http', function($http) {
  var o = {
    teams: [],
    boards: []
  };

  o.getTeam = function(id) {
    return $http.get('/teams/' + id + '/full').then(function(res) {
      angular.copy(res.data.boards, o.boards);
      return res.data;
    });
  };

  o.getAll = function() {
    return $http.get('/teams').then(function(res) {
      angular.copy(res.data, o.teams);
      return res.data;
    });
  };

  o.addTeam = function(team) {
    return $http.post('/teams', team).then(function(res) {
      o.teams.push(res.data);
      return res.data;
    });
  };

  o.addBoard = function(teamId, board) {
    return $http.post('/teams/' + teamId + '/boards', board).then(function(res) {
      o.boards.push(res.data);
      return res.data;
    }).then(function(board) {
      return $http.post('/teams/' + teamId + '/boards/' + board._id + '/currentState').then(function(res) {
        board.currentState = res.data;
        return board;
      }).then(function(board) {
        return $http.post('/teams/' + teamId + '/boards/' + board._id + '/targetState').then(function(res) {
          board.targetState = res.data;
          return board;
        }).then(function(board) {
          return $http.post('/teams/' + teamId + '/boards/' + board._id + '/awesomeState').then(function(res) {
            board.awesomeState = res.data;
            return board;
          });
        });
      });
    });
  };

  o.getBoard = function(teamId, boardId) {
    return $http.get('/teams/' + teamId + '/boards/' + boardId + '/full').then(function(res) {
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
        $scope.data = {
          teamSelect: '',
          boardSelect: ''
        };

        $scope.addTeam = function() {
            if(!$scope.teamName || $scope.teamName === '') {
                return;
            }
            teams.addTeam({
                name: $scope.teamName
            }).then(function(team){
              $scope.teams = teams.teams;
              $scope.team = team;
              $scope.data.teamSelect = team;
            });
        };

        $scope.addBoard = function() {
            if(!$scope.team || $scope.data.teamSelect === '' || !$scope.boardName || $scope.boardName === '') {
                return;
            }
            var board = {
              name: $scope.boardName
            };
            teams.addBoard($scope.data.teamSelect._id, board)
                 .then(function(board) {
              $scope.boards = teams.boards;
              $scope.board = board;
              $scope.data.boardSelect = board;
            });
        };

        $scope.getTeam = function() {
          if(!$scope.data.teamSelect) {
            $scope.team = null;
            $scope.board = null;
            $scope.boards = [];
            $scope.data.boardSelect = '';
            return;
          }
          $scope.team = teams.getTeam($scope.data.teamSelect._id);
          $scope.boards = teams.boards;
          $scope.data.boardSelect = '';
        };

        $scope.getBoard = function() {
          if(!$scope.data.boardSelect) {
            $scope.board = null;
            return;
          }
          teams.getBoard($scope.data.teamSelect._id, $scope.data.boardSelect._id).then(function(board) {
            $scope.board = board;
          });
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