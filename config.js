const express = require('express');
const userModel = require('./models/userModel');
const app = express();
const mongoose = require('mongoose');
const hbs = require('hbs');
const session = require('express-session');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const bodyParser = require('body-parser');
const dotEnv = require('dotenv').config();
const dbName = process.env.dbName;
const Cognitive = require('./models/congnitive');
let teste;
const twit = require('twit');
const {
  get_entities,
  get_sentiments,
  get_key_phrases
} = require('./cognitives/azure')

const {
  ensureAuthenticated
} = require('connect-ensure-authenticated');
const client = new twit({
  consumer_key: process.env.consumerKey,
  consumer_secret: process.env.consumerSecret,
  access_token: process.env.accessToken,
  access_token_secret: process.env.acessSecret

});

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
hbs.registerPartials(`${__dirname}/views/partials`);
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  secret: 'watchingferries',
  resave: true,
  saveUninitialized: true,
}));
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

mongoose.connect(`${process.env.MONGODB_URI}`, (error) => {
  if (error) {
    console.log('Não consegui conectar');
  } else {
    console.log(`CONECTAMOS EM banco de dados`);
  }
});

app.use(session({
  secret: process.env.secret,
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new TwitterStrategy({
    consumerKey: process.env.consumerKey,
    consumerSecret: process.env.consumerSecret,
    callbackURL: "http://127.0.0.1:3000/login/callback"
  },
  function (req, token, tokenSecret, profile, done) {
    userModel.findOne({
      twitterID: profile.id
    }).then((currentUser) => {
      // console.log(profile);
      if (currentUser) {
        // console.log(`User is: ${currentUser}`);
        done(null, currentUser);
      } else {
        new userModel({
          username: profile.username,
          twitterID: profile.id,
          name: profile.displayName,
          thumbnail: profile.photos[0].value
        }).save().then((newUser) => {
          console.log('new user created:' + newUser);
          done(null, newUser);
        })
      }
    })
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
})
passport.deserializeUser(function (id, done) {
  userModel.findById(id).then((user) => {
    done(null, user);
  })
})

app.get('/', (request, response) => {
  if (request.user) {
    response.render('analizys', {
      layout: 'layoutLoged.hbs'
    });
  } else {
    response.render('index');
  }
});

app.get('/loginUser', (request, response) => {
  response.render('login');
});

// app.get('/logedUser', ensureAuthenticated(), (request, response) => {
//   response.render('logedUser', {layout: 'layoutLoged.hbs'});
// });

app.get('/logout', (request, response) => {
  request.logout();
  response.redirect('/');
});

app.get('/logoff', (request, response) => {
  request.logout();
  response.redirect('/');
});


app.get('userDetails', (request, response) => {

});

app.get('newAnalizys', (request, response) => {

});

app.get('event', (request, response) => {

});

app.get('editAnalizys', (request, response) => {

});

app.get('createEvent', (request, response) => {

});

app.get('/login/twitter', passport.authenticate('twitter'));

app.get('/login/callback',
  passport.authenticate('twitter', {
    successRedirect: '/analizys',
    failureRedirect: '/loginUser',
  }));

app.get('/newanalizys', ensureAuthenticated(), (request, response) => {
  client.get('statuses/user_timeline', {
    count: 10,
    exclude_replies: true,
    include_rts: false
  }).then((data) => {
    const infoTwitter = data.data;
    response.render('newanalizys', {
      infoTwitter,
      layout: 'layoutLoged.hbs'
    });
  });
});

app.post('/result', (request, response) => {
  let tweets = request.body.texto;
  cognitive(tweets, request, response);
  response.redirect('analizys');
});

app.get('/analizys', (request, response) => {
  const id = request.session.passport.user;
  // console.log(id._id);
  Cognitive.find({
      user: id._id,
    })
    .then(user => {
      // console.log(user);
      if (user.length!=0) {
      response.render('analizys', {user, layout: 'layoutLoged.hbs'})
    } else{
      response.redirect('newanalizys');
    }})
});

function cognitive(tweets, request, response) {
  const arrTweets = [];
  tweets.forEach((element, idx) => {
    arrTweets.push({
      "id": idx + 1,
      "text": element
    })
  });
  const tweetsPayload = {
    "documents": arrTweets
  };
  const twitterId = request.session.passport.user.twitterID;
  userModel.findOne({
      twitterID: twitterId
    })
    .then(user => {
      Promise
        .all(
          [get_entities(tweetsPayload),
            get_key_phrases(tweetsPayload),
            get_sentiments(tweetsPayload)
          ]
        )
        .then(
          element => {
            // console.log(element[2])
            let tags = new Cognitive({
              _id: new mongoose.Types.ObjectId(),
              user: user.id,
              sentimentTags: element[0],
              keyPhrase: element[1],
              avarageRate: element[2],
            }).save(err => {
              if (err) {
                console.log('erro:', err);
              } else {
                console.log('Salvei a Tag')
              }
            });
          }
        )
    });
}


module.exports = app;