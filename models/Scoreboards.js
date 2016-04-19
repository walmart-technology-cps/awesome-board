var mongoose = require('mongoose');

var ScoreboardSchema = new mongoose.Schema({
  board: {type: mongoose.Schema.Types.ObjectId, ref: 'Board'},
  lanes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Lane'}]
});

mongoose.model('Scoreboard', ScoreboardSchema);