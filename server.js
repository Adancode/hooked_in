var express = require('express');
var app = express();
var PORT = process.env.PORT || 5000; 
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var CronJob = require('cron').CronJob;
var env = require('dotenv').load();
	//var exphbs = require('express-handlebars')

//For BodyParser
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// For Passport
app.use(session({
	secret: 'testing123',
	resave: true,
	saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//For Handlebars
// app.set('views', './views')
// app.engine('handlebars', exphbs({
// 	extname: '.handlebars'
// }));
// app.set('view engine', '.handlebars');
// app.get('/', function(req, res) {
// 	res.send('Welcome to Passport with Sequelize');
// });
app.use(express.static("./public"));

//Model
var models = require("./models");
// every saturday create a field to stats database
var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '0 8 * * 6',
  onTick: function() {
		var inTech;
    var employedOutTech;
    var studentNum;
    var noJobNum;
    var dataObject;
    models.user.findAll({
      where: {
        status: "employed-tech"
      }
    }).then(function(data) {
      inTech = data.length;
      models.user.findAll({
        where: {
          status: "employed-else"
        }
      }).then(function(employedElse) {
        employedOutTech = employedElse.length;
        models.user.findAll({
          where: {
            status: "current-student"
          }
        }).then(function(current) {
          studentNum = current.length;
          models.user.findAll({
            where: {
              status: "seeking"
            }
          }).then(function(seeking) {
            noJobNum = seeking.length;
            models.user.findAll({
              where: {
                $or: [
                  {
                    interview_time: "0 months"
                  }, {
                    interview_time: "1 months"
                  }, {
                    interview_time: "2 months"
                  }, {
                    interview_time: "3 months"
                  }
                ]
              }
            }).then(function(zeroToThree) {
              var zeroNum = zeroToThree.length;
              models.user.findAll({
                where: {
                  $or: [
                    {
                      interview_time: "4 months"
                    }, {
                      interview_time: "5 months"
                    }, {
                      interview_time: "6 months"
                    }, {
                      interview_time: "7 months"
                    }
                  ]
                }
              }).then(function(fourToSeven) {
                var fourNum = fourToSeven.length;
                models.user.findAll({
                  where: {
                    $or: [
                      {
                        interview_time: "8 months"
                      }, {
                        interview_time: "9 months"
                      }, {
                        interview_time: "10 months"
                      }, {
                        interview_time: "11 months"
                      }, {
                        interview_time: "12 months"
                      }
                    ]
                  }
                }).then(function(eightToTwelve) {
                  var eightNum = eightToTwelve.length;
									dataObject = {
										employedTech: inTech,
										employedElse: employedOutTech,
										studentNum: studentNum,
										noJob: noJobNum,
										zeroToThree: zeroNum,
										fourToSeven: fourNum,
										eightToTwelve: eightNum,
										date: Date.now()
									};
									models.statistic.create(dataObject).then(function(){
										console.log("stats updated");
									});
                });
              });
            });
          });
        });
      });
    });
  },
  start: true,
  timeZone: 'America/Los_Angeles'
});
//Routes
var authRoute = require('./routes/auth.js')(app, passport);
//load passport strategies
require('./config/passport/passport.js')(passport, models.user);
//Sync Database
models.sequelize.sync().then(function() {
	console.log('Nice! Database looks fine');
}).catch(function(err) {
	console.log(err, "Something went wrong with the Database Update!");
});
app.listen(PORT, function(err) {
	if (!err)
		console.log("Site is live");
	else console.log(err);
});
