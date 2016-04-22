var mongoose = require('mongoose');

var LaneSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  board: {type: mongoose.Schema.Types.ObjectId, ref: 'Board'},
  achievements: [{type: mongoose.Schema.Types.ObjectId, ref: 'Achievement'}]
});

mongoose.model('Lane', LaneSchema);