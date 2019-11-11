var express = require('express');
var birds = require('./birds');
const mapcache = require('./mapcache');

var passport = require('passport');
const VKontakteStrategy = require('passport-vkontakte').Strategy;

passport.use(new VKontakteStrategy({
    clientID:     7034968, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: 'CBWdmtgvCEK1QaUDrSZ4',
    callbackURL:  "https://sveltejs.ru/auth/vkontakte/callback"
  },
  function(accessToken, refreshToken, params, profile, done) {
    // console.log(params.email); // getting the email
    User.findOrCreate({ vkontakteId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));


var app = express();

app.get('/login', function(req, res) {
  res.send('Birds login page:' + app.path());
});

app.get('/auth/vkontakte',
  passport.authenticate('vkontakte'),
  function(req, res){
    // The request will be redirected to vk.com for authentication, so
    // this function will not be called.
  });

app.get('/auth/vkontakte/callback',
  passport.authenticate('vkontakte', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    // res.redirect('/');
	  let arr = Object.keys(req);
	  res.json({
		  req: JSON.stringify(arr.reduce((p, key) => {
			  p[key] = req[key];
			  return p;
		  }, {}), arr),
		  text: 'About birds',
		  tm: Date.now()
	  });

  });

app.use('/birds', birds);
//app.use('/mapcache', mapcache);

// app.get('/', function (req, res) {
  // res.send('Hello World Serg!');
// });
app.use(mapcache);
/*
app.use(function (req, res, next) {
  let arr = Object.keys(req);
  	  res.json({
		  req: JSON.stringify(arr.reduce((p, key) => {
			  p[key] = req[key];
			  return p;
		  }, {}), arr),
		  text: 'About gggg',
		  tm: Date.now()
	  });
  // res.status(200).send("Sorry can't find that!" + JSON.stringify(req));
  //res.status(404).send("Sorry can't find that!");
});
*/
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
