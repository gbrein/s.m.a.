const {
  get_sentiments,
} = require('../cognitives/azure');
const Event = require('../models/event');
const mongoose = require('mongoose');

function cognitiveSentiment(description, event) {
  const arr = [];
  const arr2 = [];
  arr.push(description);
  arr.forEach((element, idx) => {
    arr2.push({
      id: idx + 1,
      text: element,
    });
  });
  const payload = {
    documents: arr2,
  };
  get_sentiments(payload)
    .then((result) => {
      Event.findOneAndUpdate({ _id: event._id }, { cognitiveScore: result, eventScore: 1 - result })
        .then();
    });
}

module.exports = cognitiveSentiment;
