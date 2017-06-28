var mongoose = require('mongoose');

var MoodSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  date: Date,
  team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true},
  moodText: String
});

MoodSchema.index({userId: 1, date: 1}, {unique: true});

mongoose.model('Mood', MoodSchema);