/* eslint-disable func-names */
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
    'Content-Type': 'application/json',
  },
});

const saveTweet = function (documents) {
  const body = documents.documents;
  const arrBody = [];
  body.forEach((element) => {
    arrBody.push(element.text);
  });
  let arrbody2 = removeWhiteSpaceFromArray(arrBody);
  // console.log(JSON.stringify(arrbody2))
  return JSON.stringify(arrbody2);
};
const get_key_phrases = function (documents) {
  const body = JSON.stringify(documents);
  return reqaxios.post(pathK, body)
    .then((response) => {
      const key_phrases = response.data.documents;
      const arr_keys = [];
      key_phrases.forEach(element => arr_keys.push(element.keyPhrases), );
      return (arr_keys.join(',').split(' ').join(','));
    })
    .catch(err => console.log('erro:', err));
};

const get_sentiments = function (documents) {
  const body = JSON.stringify(documents);
  return reqaxios.post(pathS, body)
    .then((response) => {
      const sentiments = response.data.documents;
      const arrSentiments = [];
      sentiments.forEach((element) => {
        arrSentiments.push(element.score);
      });
      return arrSentiments.reduce((a, b) => {
        return a + b
      }) / arrSentiments.length;
    })
    .catch(err => console.log('erro:', err));
};

const get_entities = (documents) => {
  const body = JSON.stringify(documents);
  return reqaxios.post(pathE, body)
    .then((response) => {
      const body2 = response.data.documents;
      const arrBody = [];
      body2.forEach((element) => {
        arrBody.push(element.entities);
      });
      // console.log(arrBody)
      return JSON.stringify(arrBody);
    })
    .catch(err => console.log('erro:', err));
};

module.exports = {
  saveTweet,
  get_key_phrases,
  get_entities,
  get_sentiments,
};

function removeWhiteSpaceFromArray(array){
  return array.filter(item => item.trim() !== '');
}