var express = require('express');
var env = process.env.NODE_ENV || 'development';
var router = express.Router();
var mongoose = require('mongoose');
var Team = mongoose.model('Team');
var Board = mongoose.model('Board');
var State = mongoose.model('State');
var Achievement = mongoose.model('Achievement');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.param('team', function(req, res, next, id) {
    var query = Team.findById(id);

    query.exec(function (err, team) {
        if(err) {
            if('development'===env) {
              console.log('ERROR: ' + err);
            }
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
            if('development'===env) {
              console.log('ERROR: ' + err);
            }
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
            if('development'===env) {
              console.log('ERROR: ' + err);
            }
            return next(err);
        }
        if(!state) {
            return next(new Error('can\'t find state'));
        }

        req.state = state;
        return next();
    });
});

router.param('achievement', function(req, res, next, id) {
    var query = Achievement.findById(id);

    query.exec(function (err, achievement) {
        if(err) {
            if('development'===env) {
              console.log('ERROR: ' + err);
            }
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
            if('development'===env) {
              console.log('ERROR: ' + err);
            }
            return next(err);
        }
        res.json(teams);
    });
});

router.post('/teams', function(req, res, next) {
    var team = new Team(req.body);

    team.save(function(err, team) {
        if(err) {
            if('development'===env) {
              console.log('ERROR: ' + err);
            }
            if(err.code === 11000) {
              var newErr = new Error('Duplicate name not allowed');
              newErr.status = 400;
              return next(newErr);
            } else {
              return next(err);
            }
        }
        res.json(team);
    });
});

router.get('/teams/:team', function(req, res, next) {
    req.team.populate('boards', function(err, team) {
        if(err) {
            if('development'===env) {
              console.log('ERROR: ' + err);
            }
            return next(err);
        }

        res.json(team);
    });
});

router.get('/teams/:team/boards', function(req, res, next) {
  var query = Board.find({"team":req.team});

  query.exec(function(err, boards) {
    if(err) {
      if('development'===env) {
        console.log('ERROR: ' + err);
      }
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
      if('development'===env) {
        console.log('ERROR: ' + err);
      }
      if(err.code === 11000) {
        var newErr = new Error('Duplicate name not allowed');
        newErr.status = 400;
        return next(newErr);
      } else {
        return next(err);
      }
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
            if('development'===env) {
              console.log('ERROR: ' + err);
            }
            return next(err);
        }

        res.json(board);
    });
});

router.get('/teams/:team/boards/:board/states', function(req, res, next) {
  var query = State.find({"board":req.board});

  query.exec(function(err, states) {
    if(err) {
      if('development'===env) {
        console.log('ERROR: ' + err);
      }
      return next(err);
    }
    if(!states) {
      return [];
    }

    res.json(states);
  });
});

router.get('/teams/:team/boards/:board/currentState', function(req, res, next) {
  var query = State.findById(req.board.currentState);

  query.exec(function(err, state) {
    if(err) {
      if('development'===env) {
        console.log('ERROR: ' + err);
      }
      return next(err);
    }
    if(!state) {
      return {};
    }

    res.json(state);
  });
});

router.get('/teams/:team/boards/:board/targetState', function(req, res, next) {
  var query = State.findById(req.board.targetState);

  query.exec(function(err, state) {
    if(err) {
      if('development'===env) {
        console.log('ERROR: ' + err);
      }
      return next(err);
    }
    if(!state) {
      return {};
    }

    res.json(state);
  });
});

router.get('/teams/:team/boards/:board/awesomeState', function(req, res, next) {
  var query = State.findById(req.board.awesomeState);

  query.exec(function(err, state) {
    if(err) {
      if('development'===env) {
        console.log('ERROR: ' + err);
      }
      return next(err);
    }
    if(!state) {
      return {};
    }

    res.json(state);
  });
});

router.post('/teams/:team/boards/:board/currentState', function(req, res, next) {
  var state = new State(req.body);
  state.board = req.board._id;
  if(!state.title || state.title === '') {
    state.title = 'Current State';
  }
  state.save(function(err, state) {
    if(err) {
      if('development'===env) {
        console.log('ERROR: ' + err);
      }
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
  if(!state.title || state.title === '') {
    state.title = 'Target State';
  }
  state.save(function(err, state) {
    if(err) {
      if('development'===env) {
        console.log('ERROR: ' + err);
      }
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
  if(!state.title || state.title === '') {
    state.title = 'Definition of Awesome';
  }
  state.save(function(err, state) {
    if(err) {
      if('development'===env) {
        console.log('ERROR: ' + err);
      }
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
            if('development'===env) {
              console.log('ERROR: ' + err);
            }
            return next(err);
        }

        res.json(state);
    });
});

router.get('/teams/:team/boards/:board/achievements', function(req, res, next) {
  var query = Achievement.find({"board":req.board});

  query.exec(function(err, achievements) {
    if(err) {
      if('development'===env) {
        console.log('ERROR: ' + err);
      }
      return next(err);
    }
    if(!achievements) {
      return [];
    }

    res.json(achievements);
  });
});

router.post('/teams/:team/boards/:board/achievements', function(req, res, next) {
  var achievement = new Achievement(req.body);
  achievement.board = req.board._id;
  if('development'===env) {
    console.log('Achievement Date: ' + achievement.date);
  }
  if(!achievement.date && !Date.parse(achievement.date)) {
    if('development'===env) {
      console.log('HERE');
    }
    achievement.date = Date.now();
  }
  achievement.save(function(err, achievement) {
    if(err) {
      if('development'===env) {
        console.log('ERROR: ' + err);
      }
      return next(err);
    }
    req.board.achievements.push(achievement._id);
    req.board.save(function(err, board) {
      if(err) {
        return next(err);
      }
      res.json(achievement);
    });
  });
});

router.get('/teams/:team/boards/:board/achievements/:achievement', function(req, res, next) {
    req.achievement.populate(function(err, achievement) {
        if(err) {
            if('development'===env) {
              console.log('ERROR: ' + err);
            }
            return next(err);
        }

        res.json(achievement);
    });
});

module.exports = router;