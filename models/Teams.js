var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
  name: String,
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }]
});

mongoose.model('Team', TeamSchema);