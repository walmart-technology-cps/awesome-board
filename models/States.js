var mongoose = require('mongoose');

var StateSchema = new mongoose.Schema({
  title: String,
  description: String,
  board: {type: mongoose.Schema.Types.ObjectId, ref: 'Board'}
});

mongoose.model('State', StateSchema);