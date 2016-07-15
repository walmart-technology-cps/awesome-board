var mongoose = require('mongoose');

var BoardSchema = new mongoose.Schema({
  name: {type: String, required: true},
  team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
  currentState: {type: mongoose.Schema.Types.ObjectId, ref: 'State'},
  targetState: {type: mongoose.Schema.Types.ObjectId, ref: 'State'},
  awesomeState: {type: mongoose.Schema.Types.ObjectId, ref: 'State'},
  achievements: [{type: mongoose.Schema.Types.ObjectId, ref: 'Achievement'}]
});

BoardSchema.index({name: 1, team: 1}, {unique: true});

mongoose.model('Board', BoardSchema);