var mongoose = require('mongoose');

var LaneSchema = new mongoose.Schema({
  board: {type: mongoose.Schema.Types.ObjectId, ref: 'Scoreboard'},
  achievements: [{type: mongoose.Schema.Types.ObjectId, ref: 'Achievement'}]
});

mongoose.model('Lane', LaneSchema);