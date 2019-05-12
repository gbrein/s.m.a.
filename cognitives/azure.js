const https = require('https');

const accessKey = '99581ad44d6d454abcc5df216413bcd0';
const uri = 'https://brazilsouth.api.cognitive.microsoft.com';
const pathS = '/text/analytics/v2.1/sentiment';
const pathK = '/text/analytics/v2.1/keyPhrases';
const pathE = '/text/analytics/v2.1/entities';
const axios = require('axios');

const reqaxios = axios.create({
  baseURL: uri,
  timeout: 1000,
  headers: {
    'Ocp-Apim-Subscription-Key': accessKey,
    'Content-Type': 'application/json'
  },
});
const get_key_phrases = function (documents) {
  const body = JSON.stringify(documents);
  return reqaxios.post(pathK, body)
    .then(response => {
      let key_phrases = response.data.documents;
      let arr_keys = [];
      let arr_keys2 = [];
      key_phrases.forEach(element =>
        arr_keys.push(element.keyPhrases)
      );
     return (arr_keys.join(',').split(' ').join(','));

    })
    .catch(err => console.log('erro:', err));
};

const get_sentiments = function (documents) {
  const body = JSON.stringify(documents);
  return reqaxios.post(pathS, body)
    .then(response => {
      let sentiments = response.data.documents
      let arrSentiments = [];
      sentiments.forEach(element => {
        arrSentiments.push(element.score);
      });
      return arrSentiments.reduce(function (a, b) {
        return a + b
      }) / arrSentiments.length;
    })
    .catch(err => console.log('erro:', err));
};

const get_entities = (documents) => {
  const body = JSON.stringify(documents);
  return reqaxios.post(pathE, body)
    .then(response => JSON.stringify(response.data.documents))
    .catch(err => console.log('erro:', err));
};

module.exports = {
  get_key_phrases,
  get_entities,
  get_sentiments
};