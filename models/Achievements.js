var mongoose = require('mongoose');

var AchievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  lane: {type: mongoose.Schema.Types.ObjectId, ref: 'Lane'}
});

mongoose.model('Achievement', AchievementSchema);