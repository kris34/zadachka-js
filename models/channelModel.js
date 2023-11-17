const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  duration: { type: String },
  URL: { type: String },
  tvgId: {type: String},
  groupTitle: {type: String}
});

const Channel = new mongoose.model('Channel', schema);

module.exports = Channel;
