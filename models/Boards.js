var mongoose = require('mongoose');

var BoardSchema = new mongoose.Schema({
  name: String,
  team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
  currentState: {type: mongoose.Schema.Types.ObjectId, ref: 'State'},
  targetState: {type: mongoose.Schema.Types.ObjectId, ref: 'State'},
  awesomeState: {type: mongoose.Schema.Types.ObjectId, ref: 'State'},
  scoreboard: {type: mongoose.Schema.Types.ObjectId, ref: 'Scoreboard'}
});

mongoose.model('Board', BoardSchema);