var express = require('express');
var env = process.env.NODE_ENV || 'development';
var router = express.Router();
var mongoose = require('mongoose');
var Team = mongoose.model('Team');
var Board = mongoose.model('Board');
var State = mongoose.model('State');
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
  var query = State.findById(req.board.currentState);

  query.exec(function(err, state) {
    if(err) {
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

router.get('/teams/:team/boards/:board/scoreboard', function(req, res, next) {
  var query = Lane.find({"board":req.board});

  query.exec(function(err, lanes) {
    if(err) {
      return next(err);
    }
    if(!lanes) {
      return [];
    }

    res.json(lanes);
  });
});

router.post('/teams/:team/boards/:board/scoreboard', function(req, res, next) {
  var numLanes = req.body.numLanes;
  var resJson = [];
  req.board.lanes = [];

  var currentQuery = State.findById(req.board.currentState);
  var targetQuery = State.findById(req.board.targetState);
  var currentDate, targetDate;
  var lane;

  currentQuery.exec(function (err, state) {
    if(!err && state) {
      currentDate = Date.parse(state.date);
      targetQuery.exec(function (err, state) {
        if(!err && state) {
          targetDate = Date.parse(state.date);
          for(var i=0; i<numLanes; i++) {
            lane = new Lane();
            lane.board = req.board._id;
            if(currentDate && targetDate) {
              lane.startDate = new Date(currentDate + (((targetDate - currentDate)/numLanes) * i)+1);
              lane.endDate = new Date(currentDate + (((targetDate - currentDate)/numLanes) * (i+1)));
            }
            lane.save(function(err, lane) {
              if(err) {
                return next(err);
              }
              req.board.lanes.push(lane._id);
              req.board.save(function(err, board) {
                if(err) {
                  return next(err);
                }
              });
            });
            resJson.push(lane);
          }
          res.json(resJson);
        } else {
          for(var i=0; i<numLanes; i++) {
            lane = new Lane();
            lane.board = req.board._id;
            lane.save(function(err, lane) {
              if(err) {
                return next(err);
              }
              req.board.lanes.push(lane._id);
              req.board.save(function(err, board) {
                if(err) {
                  return next(err);
                }
              });
            });
            resJson.push(lane);
          }
          res.json(resJson);
        }
      });
    }  else {
      for(var i=0; i<numLanes; i++) {
        lane = new Lane();
        lane.board = req.board._id;
        lane.save(function(err, lane) {
          if(err) {
            return next(err);
          }
          req.board.lanes.push(lane._id);
          req.board.save(function(err, board) {
            if(err) {
              return next(err);
            }
          });
        });
        resJson.push(lane);
      }
      res.json(resJson);
    }
  });
});

router.post('/teams/:team/boards/:board/scoreboard/lanes', function(req, res, next) {
  var lane = new Lane(req.body);
  lane.board = req.board._id;
  lane.save(function(err, lane) {
    if(err) {
      return next(err);
    }
    req.board.lanes.push(lane._id);
    req.board.save(function(err, board) {
      if(err) {
        return next(err);
      }
      res.json(lane);
    });
  });
});

router.get('/teams/:team/boards/:board/scoreboard/lanes/:lane', function(req, res, next) {
    req.lane.populate(function(err, lane) {
        if(err) {
            return next(err);
        }

        res.json(lane);
    });
});

router.get('/teams/:team/boards/:board/scoreboard/lanes/:lane/achievements', function(req, res, next) {
  var query = Achievement.find({"lane":req.lane});

  query.exec(function(err, achievements) {
    if(err) {
      return next(err);
    }
    if(!achievements) {
      return [];
    }

    res.json(achievements);
  });
});

router.post('/teams/:team/boards/:board/scoreboard/lanes/:lane/achievements', function(req, res, next) {
  var achievement = new Achievement(req.body);
  achievement.lane = req.lane._id;
  achievement.save(function(err, achievement) {
    if(err) {
      return next(err);
    }
    req.lane.achievements.push(achievement._id);
    req.lane.save(function(err, lane) {
      if(err) {
        return next(err);
      }
      res.json(achievement);
    });
  });
});

router.get('/teams/:team/boards/:board/scoreboard/lanes/:lane/achievements/:achievement', function(req, res, next) {
    req.achievement.populate(function(err, achievement) {
        if(err) {
            return next(err);
        }

        res.json(achievement);
    });
});

router.get('/teams/:team/boards/:board/scoreboard/achievements', function(req, res, next) {
  var query = Achievement.find({"lane":{$in:req.board.lanes}});

  query.exec(function(err, achievements) {
    if(err) {
      return next(err);
    }
    if(!achievements) {
      return [];
    }

    res.json(achievements);
  });
});

router.post('/teams/:team/boards/:board/scoreboard/achievements', function(req, res, next) {
  var achievement = new Achievement(req.body);
  var query = Lane.find({'board':req.board});
  var now = Date.now();
  var lane, start, end;

  if('development'===env) {
    console.log('Adding achievement!');
    console.log(now);
  }

  if(achievement.date) {
    now = Date.parse(achievement.date);

    if('development'===env) {
      console.log('Changing date!');
      console.log(now);
    }
  } else {
    achievement.date = new Date(now);
  }

  query.exec(function(err, lanes) {
    if(err) {
      return next(err);
    }
    if(!lanes) {
      return next(new Error('No lanes found!'));
    }

    if('development'===env) {
      console.log('LANES!!!');
      console.log(lanes);
    }

    for(var i=0; lanes && i<lanes.length; i++) {
      lane = lanes[i];
      start = Date.parse(lane.startDate);
      end = Date.parse(lane.endDate);
      if('development'===env) {
        console.log('Start of lane: ' + start);
        console.log('End of lane:   ' + end);
      }
      if(start && end && now >+ start && now <= end) {
        if('development'===env) {
          console.log('Found lane: ' + lane._id);
        }
        achievement.lane = lane._id;
        req.lane = lane;
        break;
      }
    }

    if(!req.lane) {
      return next(new Error('Can\'t find lane for achievement'));
    }

    achievement.save(function(err, achievement) {
      if(err) {
        return next(err);
      }
      req.lane.save(function(err, lane) {
        if(err) {
          return next(err)
        }
      });
      res.json(achievement);
    });
  });
});

router.get('/teams/:team/boards/:board/scoreboard/achievements/:achievement', function(req, res, next) {
    req.achievement.populate(function(err, achievement) {
        if(err) {
            return next(err);
        }

        res.json(achievement);
    });
});

module.exports = router;

















