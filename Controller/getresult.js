const mongoose = require('mongoose');
const Event = require('../models/event');
const Cognitive = require('../models/congnitive');
const mood = require('../Controller/mood')

function getResult(id, response) {
  // console.log(id);
  Cognitive.findOne({
      _id: id,
    })
    .then((data) => {
      const aRate = JSON.parse(data.avarageRate);
      const moodRate = mood(aRate);
      // console.log(moodRate);
      Event.find()
        .then((result) => {
          let arrNear = [];
          result.forEach((element) => {
            if (mood(element.eventScore) === moodRate) {
              arrNear.push(element);
            }
          })
          // console.log(arrNear)
          response.render('result', {
            arrNear, moodRate,
            layout: 'layoutLoged.hbs',
          });
        });
    });
}

module.exports = getResult;