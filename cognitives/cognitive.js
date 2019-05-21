const Cognitive = require('../models/congnitive');
const userModel = require('../models/userModel');
const mongoose = require('mongoose');
const {
  get_entities,
  get_sentiments,
  get_key_phrases,
  saveTweet,
} = require('../cognitives/azure');

function cognitive(tweets, request, response) {
  const arrTweets = [];
  tweets.forEach((element, idx) => {
    arrTweets.push({
      id: idx + 1,
      text: element,
    });
  });
  const tweetsPayload = {
    documents: arrTweets,
  };
  const twitterId = request.session.passport.user.twitterID;
  userModel.findOne({
    twitterID: twitterId,
  })
    .then((user) => {
      Promise
        .all(
          [
            get_entities(tweetsPayload),
            get_key_phrases(tweetsPayload),
            get_sentiments(tweetsPayload),
            saveTweet(tweetsPayload),
          ],
        )
        .then(
          (element) => {
            // console.log(element[2])
            const tags = new Cognitive({
              _id: new mongoose.Types.ObjectId(),
              user: user.id,
              sentimentTags: element[0],
              keyPhrase: element[1],
              avarageRate: element[2],
              tweets: element[3],
            }).save((err) => {
              if (err) {
                console.log('erro:', err);
              } else {
                console.log('Salvei a Tag');
              }
            });
          },
        );
    });
}


module.exports = cognitive;
