const mongoose = require('mongoose');
const Cognitive = require('../models/congnitive');

function deleteAnalyze(id) {
  Cognitive.findOneAndDelete({
    _id: id
  }, function (error, id) {}).then()
}
module.exports = deleteAnalyze;