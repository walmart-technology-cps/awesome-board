var mongoose = require('mongoose');

var AchievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  lane: {type: mongoose.Schema.Types.ObjectId, ref: 'Lane'}
});

mongoose.model('Achievement', AchievementSchema);