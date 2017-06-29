var mongoose = require('mongoose');

var MoodSchema = new mongoose.Schema({
  date: {type: Date, required: true},
  team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true},
  moodText: {type: String, required: true}
});

mongoose.model('Mood', MoodSchema);