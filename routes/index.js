var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Team = mongoose.model('Team');
var Board = mongoose.model('Board');
var State = mongoose.model('State');
var Scoreboard = mongoose.model('Scoreboard');
var Lane = mongoose.model('Lane');
var Achievement = mongoose.model('Achievement');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.param('team', function(req, res, next, id) {
    var query = Team.findById(id);

    query.exec(function (err, team) {
        if(err) {
            return next(err);
        }
        if(!team) {
            return next(new Error('can\'t find team'));
        }

        req.team = team;
        return next();
    });
});

router.param('board', function(req, res, next, id) {
    var query = Board.findById(id);

    query.exec(function (err, board) {
        if(err) {
            return next(err);
        }
        if(!board) {
            return next(new Error('can\'t find board'));
        }

        req.board = board;
        return next();
    });
});

router.param('state', function(req, res, next, id) {
    var query = State.findById(id);

    query.exec(function (err, state) {
        if(err) {
            return next(err);
        }
        if(!state) {
            return next(new Error('can\'t find state'));
        }

        req.state = state;
        return next();
    });
});

router.param('scoreboard', function(req, res, next, id) {
    var query = Scoreboard.findById(id);

    query.exec(function (err, scoreboard) {
        if(err) {
            return next(err);
        }
        if(!scoreboard) {
            return next(new Error('can\'t find scoreboard'));
        }

        req.scoreboard = scoreboard;
        return next();
    });
});

router.param('lane', function(req, res, next, id) {
    var query = Lane.findById(id);

    query.exec(function (err, lane) {
        if(err) {
            return next(err);
        }
        if(!lane) {
            return next(new Error('can\'t find lane'));
        }

        req.lane = lane;
        return next();
    });
});

router.param('achievement', function(req, res, next, id) {
    var query = Achievement.findById(id);

    query.exec(function (err, achievement) {
        if(err) {
            return next(err);
        }
        if(!achievement) {
            return next(new Error('can\'t find achievement'));
        }

        req.achievement = achievement;
        return next();
    });
});

router.get('/teams', function(req, res, next) {
    Team.find(function(err, teams) {
        if(err) {
            return next(err);
        }
        res.json(teams);
    });
});

router.post('/teams', function(req, res, next) {
    var team = new Team(req.body);

    team.save(function(err, team) {
        if(err) {
            return next(err);
        }
        res.json(team);
    });
});

router.get('/teams/:team', function(req, res, next) {
    req.team.populate('boards', function(err, team) {
        if(err) {
            return next(err);
        }

        res.json(team);
    });
});

router.get('/teams/:team/boards', function(req, res, next) {
  var query = Board.find({"team":req.team});

  query.exec(function(err, boards) {
    if(err) {
      return next(err);
    }
    if(!boards) {
      return [];
    }

    res.json(boards);
  });
});

router.post('/teams/:team/boards', function(req, res, next) {
  var board = new Board(req.body);
  board.team = req.team._id;
  board.save(function(err, board) {
    if(err) {
      return next(err);
    }
    req.team.boards.push(board._id);
    req.team.save(function(err, team) {
      if(err) {
        return next(err);
      }
      res.json(board);
    });
  });
});

router.get('/teams/:team/boards/:board', function(req, res, next) {
    req.board.populate(function(err, board) {
        if(err) {
            return next(err);
        }

        res.json(board);
    });
});

router.get('/teams/:team/boards/:board/states', function(req, res, next) {
  var query = State.find({"board":req.board});

  query.exec(function(err, states) {
    if(err) {
      return next(err);
    }
    if(!states) {
      return [];
    }

    res.json(states);
  });
});

router.get('/teams/:team/boards/:board/currentState', function(req, res, next) {
  var query = State.find({"_id":req.board.currentState});

  query.exec(function(err, state) {
    if(err) {
      return next(err);
    }
    if(!state) {
      return [];
    }

    res.json(state);
  });
});

router.get('/teams/:team/boards/:board/targetState', function(req, res, next) {
  var query = State.find({"_id":req.board.targetState});

  query.exec(function(err, state) {
    if(err) {
      return next(err);
    }
    if(!state) {
      return [];
    }

    res.json(state);
  });
});

router.get('/teams/:team/boards/:board/awesomeState', function(req, res, next) {
  var query = State.find({"_id":req.board.awesomeState});

  query.exec(function(err, state) {
    if(err) {
      return next(err);
    }
    if(!state) {
      return [];
    }

    res.json(state);
  });
});

router.post('/teams/:team/boards/:board/currentState', function(req, res, next) {
  var state = new State(req.body);
  state.board = req.board._id;
  state.save(function(err, state) {
    if(err) {
      return next(err);
    }
    req.board.currentState = state._id;
    req.board.save(function(err, board) {
      if(err) {
        return next(err);
      }
      res.json(state);
    });
  });
});

router.post('/teams/:team/boards/:board/targetState', function(req, res, next) {
  var state = new State(req.body);
  state.board = req.board._id;
  state.save(function(err, state) {
    if(err) {
      return next(err);
    }
    req.board.targetState = state._id;
    req.board.save(function(err, board) {
      if(err) {
        return next(err);
      }
      res.json(state);
    });
  });
});

router.post('/teams/:team/boards/:board/awesomeState', function(req, res, next) {
  var state = new State(req.body);
  state.board = req.board._id;
  state.save(function(err, state) {
    if(err) {
      return next(err);
    }
    req.board.awesomeState = state._id;
    req.board.save(function(err, board) {
      if(err) {
        return next(err);
      }
      res.json(state);
    });
  });
});

router.get('/teams/:team/boards/:board/states/:state', function(req, res, next) {
    req.state.populate(function(err, state) {
        if(err) {
            return next(err);
        }

        res.json(state);
    });
});

module.exports = router;
