let https = require ('https');
let accessKey = '99581ad44d6d454abcc5df216413bcd0';
let uri = 'brazilsouth.api.cognitive.microsoft.com';
let pathS = '/text/analytics/v2.1/sentiment';
let pathK = '/text/analytics/v2.1/keyPhrases';
let pathE = '/text/analytics/v2.1/entities';

let response_handler = function (response) {
  let body = '';
  response.on ('data', function (d) {
      body += d;
  });
  response.on ('end', function () {
      let body_ = JSON.parse (body);
      let body__ = JSON.stringify (body_, null, '  ');
  });
  response.on ('error', function (e) {
      console.log ('Error: ' + e.message);
  });
  
};

let get_key_phrases = function (documents) {
  let body = JSON.stringify (documents);

  let request_params = {
      method : 'POST',
      hostname : uri,
      path : pathK,
      headers : {
          'Ocp-Apim-Subscription-Key' : accessKey,
      }
  };
  let req = https.request (request_params, response_handler);
  req.write (body);
  req.end ();
}

let get_sentiments = function (documents) {
  let body = JSON.stringify (documents);

  let request_params = {
      method : 'POST',
      hostname : uri,
      path : pathS,
      headers : {
          'Ocp-Apim-Subscription-Key' : accessKey,
      }
  };

  let req = https.request (request_params, response_handler);
  req.write (body);
  req.end ();
}

let get_entities = function (documents) {
  let body = JSON.stringify (documents);

  let request_params = {
      method : 'POST',
      hostname : uri,
      path : pathE,
      headers : {
          'Ocp-Apim-Subscription-Key' : accessKey,
      }
  };
  let req = https.request (request_params, response_handler);
  req.write (body);
  req.end ();
}

module.exports = {get_key_phrases,get_entities,get_sentiments};