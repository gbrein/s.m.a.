const mongoose = require('mongoose');
const Cognitive = require('../models/congnitive');
const cognitive = require ('../cognitives/cognitive')

function editAnalyze(id, response) {
  Cognitive.findOne({
    _id: id,
  }).then((edit) => {
    console.log(edit.tweets);
    response.render('editanalyze', 
    {edit, layout: 'layoutLoged',});
  });
}


module.exports = editAnalyze;