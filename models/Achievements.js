var mongoose = require('mongoose');

var AchievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  board: {type: mongoose.Schema.Types.ObjectId, ref: 'Board'}
});

mongoose.model('Achievement', AchievementSchema);