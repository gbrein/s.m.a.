const mongoose = require('mongoose');
const Cognitive = require('../models/congnitive');

function editAnalyze(id, response) {
  Cognitive.findOne({
    _id: id,
  }).then((data) => {
    console.log(data);
    response.render('editanalyze', {
      data,
      layout: 'layoutLoged',
    });
  });
}


module.exports = editAnalyze;