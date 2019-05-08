const express = require('express');
const userModel = require('./models/userModel');
const app = express();
const dbName = 'projeto-final';
const mongoose = require('mongoose');
const hbs = require('hbs');
const session = require('express-session');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const bodyParser = require('body-parser');
const dotEnv = require('dotenv').config();
const twit = require('twit');
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

mongoose.connect(`mongodb://localhost/${dbName}`, (error) => {
  if (error) {
    console.log('Não consegui conectar');
  } else {
    console.log(`CONECTAMOS EM ${dbName}`);
  }
});

app.use(session({
  secret: dotEnv.parsed.secret,
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new TwitterStrategy({
    consumerKey: dotEnv.parsed.consumerKey,
    consumerSecret: dotEnv.parsed.consumerSecret,
    callbackURL: "http://127.0.0.1:3000/login/callback"
  },
  function (req, token, tokenSecret, profile, done) {
    userModel.findOne({
      twitterID: profile.id
    }).then((currentUser) => {
      // console.log(profile);
      if (currentUser) {
        console.log(`User is: ${currentUser}`);
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
    response.render('logedUser', {
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
//   console.log(request.user);
//   response.render('logedUser', {
//     layout: 'layoutLoged.hbs'
//   });
// });

app.get('/logout', (request, response) => {
  request.logout();
  response.redirect('/');
});

app.get('/logoff', (request, response) => {
  request.logout();
  response.redirect('/');
});

app.get('/login/twitter', passport.authenticate('twitter'));

app.get('/login/callback',
  passport.authenticate('twitter', {
    successRedirect: '/logedUser',
    failureRedirect: '/loginUser',
  }));

app.get('/logedUser', ensureAuthenticated(), (request, response) => {
  client.get('statuses/user_timeline', {
    count: 20,
    exclude_replies: true,
    include_rts: false
  }).then((data) => {
    let tweets = data.data.map((element) => {
      // console.log(element.text);
      return element.text
    });
    console.log(tweets);
    response.render('logedUser', {tweets, layout: 'layoutLoged.hbs'});
  }); 
});

module.exports = app;