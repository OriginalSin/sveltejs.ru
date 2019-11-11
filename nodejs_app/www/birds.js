var express = require('express');
// var fetch = require('node-fetch');
	// fs = require('fs-extra'),
var passport = require('passport');
const VKontakteStrategy = require('passport-vkontakte').Strategy;

var router = express.Router();

passport.use(new VKontakteStrategy({
    clientID:     7034968, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: 'CBWdmtgvCEK1QaUDrSZ4',
    callbackURL:  "https://sveltejs.ru/birds/auth/vkontakte/callback"
  },
  function(accessToken, refreshToken, params, profile, done) {
    // console.log(params.email); // getting the email
    User.findOrCreate({ vkontakteId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/auth/vkontakte',
  passport.authenticate('vkontakte'),
  function(req, res){
    // The request will be redirected to vk.com for authentication, so
    // this function will not be called.
  });
router.get('/login', function(req, res) {
  res.send('Birds login page');
});

router.get('/auth/vkontakte/callback',
  // passport.authenticate('vkontakte', { failureRedirect: '/login' }),
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

// define the home page route
router.get('/', function(req, res) {
  res.send('Birds home page');
});
// define the about route
router.get('/about', function(req, res) {
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

router.get('/ais', function(req, res) {
	var mysql = require('mysql'),
		connection = mysql.createConnection({
			host     : 'localhost',
			user     : 'host1730430_serg',
			password : '1fb6e4e1',
			database : 'host1730430_ais'
		});
	connection.connect();

	connection.query('SELECT * from ais_names ORDER BY mmsi DESC limit 10', function(err, rows, fields) {
		// if (err) throw err;
// console.log('The solution is: ', rows[0].solution);
		connection.end();
		res.json({
			fields: fields,
			rows: rows,
			err: err,
			text: 'db',
			tm: Date.now()
		});
	});

	// connection.end();
	// res.json({
		// req: [],
		// text: 'db',
		// tm: Date.now()
	// });
});

module.exports = router;
