const mongoose = require('mongoose');
const Cognitive = require('../models/congnitive');
const cognitive = require('../cognitives/cognitive');
const {
  get_entities,
  get_sentiments,
  get_key_phrases,
  saveTweet,
} = require('../cognitives/azure');

function editAnalyze(id, response) {
  Cognitive.findOne({
    _id: id,
  }).then((edit) => {
    const arrTweets = edit.tweets;
    const id = edit._id;
    response.render('editanalyze', {
      arrTweets,
      id,
      layout: 'layoutLoged',
    });
  });
}

function editCognitive(tweets, id, request, response) {
  const arr = [];
  const arr2 = [];
  arr.push(JSON.stringify(tweets));
  arr.forEach((element, idx) => {
    arr2.push({
      // language: "en",
      id: idx + 1,
      text: element,
    });
  });
  const payload = {
    documents: arr2,
  };
  Promise
    .all(
      [
        get_entities(payload),
        get_key_phrases(payload),
        get_sentiments(payload),
      ],
    )
    .then(
      (element) => {
        Cognitive.findOneAndUpdate({
          _id: id,
        }, {
          sentimentTags: element[0],
          keyPhrase: element[1],
          avarageRate: element[2],
          tweets: tweets,
        }).then(() => {
          console.log('tag atualizada')
        })
      });
      response.redirect('/analizys');
};

module.exports = {
  editAnalyze,
  editCognitive
};