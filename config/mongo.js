const mongoose = require('mongoose');

async function initMongo() {
  mongoose.connect('mongodb://localhost:27017/m3ufiles');
}

module.exports = {
  initMongo,
};
