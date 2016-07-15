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

  o.getTeams = function() {
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
      return $http.post('/teams/' + teamId + '/boards/' + board._id + '/currentState', {description:'Describe the Current State'}).then(function(res) {
        board.currentState = res.data;
        return board;
      }).then(function(board) {
        return $http.post('/teams/' + teamId + '/boards/' + board._id + '/targetState', {description:'Describe your Target State'}).then(function(res) {
          board.targetState = res.data;
          return board;
        }).then(function(board) {
          return $http.post('/teams/' + teamId + '/boards/' + board._id + '/awesomeState', {description:'Define Awesome'}).then(function(res) {
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

  o.updateBoard = function(board) {
    return $http.put('/teams/' + board.team + '/boards/' + board._id, board).then(function(res) {
      return $http.get('/teams/' + board.team + '/boards').then(function(res) {
        angular.copy(res.data, o.boards);
        return board;
      });
    });
  };

  o.updateState = function(teamId, boardId, updatedState) {
    return $http.put('teams/' + teamId + '/boards/' + boardId + '/states/' + updatedState._id, updatedState).then(function(res) {
      return res.data;
    });
  };

  o.addAchievement = function(teamId, boardId, achievement) {
    return $http.post('/teams/' + teamId + '/boards/' + boardId + '/achievements', achievement).then(function(res) {
      return res.data;
    });
  };

  o.getAchievements = function(teamId, boardId) {
    return $http.get('/teams/' + teamId + '/boards/' + boardId + '/achievements').then(function(res) {
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
      if(!$scope.data.teamSelect || ''===$scope.data.teamSelect) {
        $scope.team = null;
        $scope.board = null;
        $scope.boards = [];
        $scope.data.boardSelect = '';
        return;
      }
      $scope.team = teams.getTeam($scope.data.teamSelect._id);
      $scope.boards = teams.boards;
      $scope.board = null;
      $scope.data.boardSelect = '';
    };

    $scope.getBoard = function() {
      if(!$scope.data.boardSelect) {
        $scope.board = null;
        return;
      }
      teams.getBoard($scope.data.teamSelect._id, $scope.data.boardSelect._id).then(function(board) {
        $scope.board = board;
        if(!$scope.team.name) {
          $scope.team = $scope.team.$$state.value;
        }
      });
    };

    $scope.updateState = function(state) {
      if(!state) {
        return;
      }
      teams.updateState($scope.data.teamSelect._id, $scope.data.boardSelect._id, state);
    };

    $scope.updateBoard = function(board) {
      if(!board) {
        return;
      }
      teams.updateBoard(board).then(function(board) {
        $scope.boards = teams.boards;
        $scope.board = board;
        $scope.data.boardSelect = board;
      });
    };

    $scope.addAchievement = function() {
      if(!$scope.team || $scope.data.teamSelect === '' || !$scope.board || $scope.boardSelect === '') {
        return;
      }
      if(!$scope.data.achievementDesc || $scope.data.achievementDesc === '') {
        return;
      }
      var achievement = {
        title: $scope.data.achievementTitle,
        description: $scope.data.achievementDesc
      }
      teams.addAchievement($scope.data.teamSelect._id, $scope.data.boardSelect._id, achievement).then(function(achievement) {
        teams.getAchievements($scope.data.teamSelect._id, $scope.data.boardSelect._id).then(function(achievements) {
          $scope.board.achievements = achievements;
          $scope.data.achievementTitle = '';
          $scope.data.achievementDesc = '';
        })
      });
    };
  }
]);

app.directive( 'editableStateDescription', function() {
  return {
    restrict: 'E',
    scope: { value: '=', update: '=' },
    template: '<span ng-click="edit()" ng-bind="value"></span><textarea ng-model="value"></textarea>',
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = angular.element( element.children()[1] );

      // This directive should have a set class so we can style it.
      element.addClass( 'edit-in-place' );

      // Initially, we're not editing.
      $scope.editing = false;

      // ng-click handler to activate edit-in-place
      $scope.edit = function () {
        $scope.editing = true;

        // We control display through a class on the directive itself. See the CSS.
        element.addClass( 'active' );

        // And we must focus the element.
        // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function,
        // we have to reference the first element in the array.
        inputElement[0].focus();
      };

      // When we leave the input, we're done editing.
      inputElement.prop( 'onblur', function() {
        $scope.editing = false;
        element.removeClass( 'active' );
        $scope.$parent.updateState($scope.update);
      });
    }
  };
});

app.directive( 'editableStateTitle', function() {
  return {
    restrict: 'E',
    scope: { value: '=', update: '=' },
    template: '<span ng-click="edit()" ng-bind="value"></span><input ng-model="value"></input>',
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = angular.element( element.children()[1] );

      // This directive should have a set class so we can style it.
      element.addClass( 'edit-in-place' );

      // Initially, we're not editing.
      $scope.editing = false;

      // ng-click handler to activate edit-in-place
      $scope.edit = function () {
        $scope.editing = true;

        // We control display through a class on the directive itself. See the CSS.
        element.addClass( 'active' );

        // And we must focus the element.
        // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function,
        // we have to reference the first element in the array.
        inputElement[0].focus();
      };

      // When we leave the input, we're done editing.
      inputElement.prop( 'onblur', function() {
        $scope.editing = false;
        element.removeClass( 'active' );
        $scope.$parent.updateState($scope.update);
      });
    }
  };
});

app.directive( 'editableBoardName', function() {
  return {
    restrict: 'E',
    scope: { value: '=', update: '=' },
    template: '<span ng-click="edit()" ng-bind="value"></span><input ng-model="value"></input>',
    link: function ( $scope, element, attrs ) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = angular.element( element.children()[1] );

      // This directive should have a set class so we can style it.
      element.addClass( 'edit-in-place' );

      // Initially, we're not editing.
      $scope.editing = false;

      // ng-click handler to activate edit-in-place
      $scope.edit = function () {
        $scope.editing = true;

        // We control display through a class on the directive itself. See the CSS.
        element.addClass( 'active' );

        // And we must focus the element.
        // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function,
        // we have to reference the first element in the array.
        inputElement[0].focus();
      };

      // When we leave the input, we're done editing.
      inputElement.prop( 'onblur', function() {
        $scope.editing = false;
        element.removeClass( 'active' );
        $scope.$parent.updateBoard($scope.update);
      });
    }
  };
});

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
        return teams.getTeams();
      }]
    }
  });

  $urlRouterProvider.otherwise('home');
}]);