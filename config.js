const express = require('express');

const app = express();
const mongoose = require('mongoose');
const hbs = require('hbs');
const session = require('express-session');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const bodyParser = require('body-parser');
const dotEnv = require('dotenv').config();
const deleteAnalyze = require('./Controller/delete');
const getResult = require('./Controller/getresult');
const cognitiveSentiment = require('./cognitives/cognitiveSentiment');
const upload = require('./Controller/upload');
const {
  editAnalyze,
  editCognitive,
} = require('./Controller/edit');
const multer = require('multer');
const Event = require('./models/event');

// const upload = multer({
//   dest: './uploads',
// });

const {
  dbName,
} = process.env;
const Cognitive = require('./models/congnitive');
const cognitive = require('./cognitives/cognitive');
const twit = require('twit');
const moment = require('moment');
const {
  ensureAuthenticated,
} = require('connect-ensure-authenticated');
const userModel = require('./models/userModel');

const client = new twit({
  consumer_key: process.env.consumerKey,
  consumer_secret: process.env.consumerSecret,
  access_token: process.env.accessToken,
  access_token_secret: process.env.acessSecret,

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
    console.log('CONECTAMOS EM banco de dados');
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
  // callbackURL: 'https://pure-forest-44229.herokuapp.com/login/callback',
  callbackURL: 'http://127.0.0.1/login/callback',
},
((req, token, tokenSecret, profile, done) => {
  userModel.findOne({
    twitterID: profile.id,
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
        thumbnail: profile.photos[0].value,
      }).save().then((newUser) => {
        console.log(`new user created:${newUser}`);
        done(null, newUser);
      });
    }
  });
})));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((id, done) => {
  userModel.findById(id).then((user) => {
    done(null, user);
  });
});

app.get('/', (request, response) => {
  if (request.user) {
    response.render('analizys', {
      layout: 'layoutLoged.hbs',
    });
  } else {
    response.render('index');
  }
});

app.get('/loginUser', (request, response) => {
  response.render('login');
});

app.get('/logout', (request, response) => {
  request.logout();
  response.redirect('/');
});

app.get('/logoff', (request, response) => {
  request.logout();
  response.redirect('/');
});

app.get('event', (request, response) => {

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
    include_rts: false,
  }).then((data) => {
    const infoTwitter = data.data;
    response.render('newanalizys', {
      infoTwitter,
      layout: 'layoutLoged.hbs',
    });
  });
});

app.post('/result', (request, response) => {
  const tweets = request.body.texto;
  cognitive(tweets, request, response);
  response.redirect('analizys');
});

app.get('/analizys', (request, response) => {
  const id = request.session.passport.user;
  Cognitive.find({
    user: id._id,
  })
    .then((user) => {
      // console.log(user);
      if (user.length != 0) {
        response.render('analizys', {
          user,
          layout: 'layoutLoged.hbs',
        });
      } else {
        response.redirect('newanalizys');
      }
    });
});

app.get('/analyze/delete/:id', (request, response) => {
  const { id } = request.params;
  deleteAnalyze(id);
  response.redirect('/analizys');
});

app.get('/analyze/edit/:id', (request, response) => {
  const { id } = request.params;
  editAnalyze(id, response);
});


app.post('/update', (request, response) => {
  const tweets = request.body.texto;
  const { id } = request.body;
  editCognitive(tweets, id, request, response);
});

app.get('/newevent', (request, response) => {
  response.render('newevent');
});

app.post('/upload', upload.single('photo'), (request, response) => {
  
  const event = new Event({
    name: request.body.oName,
    date: request.body.date,
    email: request.body.Email,
    title: request.body.Title,
    type: request.body.type,
    description: request.body.description,
    city: request.body.city,
    zip: request.body.zip,
    address: request.body.address,
    state: request.body.state,
    link: request.body.link,
    path: request.file.location,
    originalName: request.file.originalname,
  });
  event.save((err) => {
    cognitiveSentiment(request.body.description, event);
    response.redirect('/');
  });
});

app.get('/analyze/:id', (request, response) => {
  const { id } = request.params;
  getResult(id, response);
});

module.exports = app;
