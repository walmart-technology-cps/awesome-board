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

    team.save(function(err, post) {
        if(err) {
            return next(err);
        }
        res.json(team);
    });
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

router.get('/teams/:team', function(req, res, next) {
    req.team.populate('boards', function(err, team) {
        if(err) {
            return next(err);
        }

        res.json(team);
    });
});

module.exports = router;
