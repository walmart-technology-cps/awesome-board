var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }]
});

mongoose.model('Team', TeamSchema);