var express = require('express');
var router = express.Router();

var path = require('path');
var env = require('dotenv').config();
const Client = require('pg').Client;
const client = (() => {
  if (process.env.NODE_ENV !== 'production') {
      return new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: false
      });
  } else {
      return new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: {
              rejectUnauthorized: false
            }
      });
  } })();
client.connect(); //connect to database

var passport = require('passport');
var bcrypt = require('bcryptjs');

router.get('/logout', function(req, res){
  req.logout(); //passport provide it
  res.redirect('/login'); // Successful. redirect to localhost:3000/login
});

// localhost:3000/login
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname,'..', 'public','login.html'));
});
router.get('/signup', function(req, res, next) {
  res.sendFile(path.join(__dirname,'..', 'public','signup.html'));
});
router.post('/signup', function(req, res, next){
  var salt = bcrypt.genSaltSync(10);
  var password = bcrypt.hashSync(req.body.password, salt);
  client.query('SELECT * FROM espnuser WHERE username = $1', [req.body.username], function(err, result) {
    if (err) {
      console.log("unable to query SELECT");
      next(err);
    }
    if (result.rows.length > 0) {
        console.log("User exist");
        res.redirect('/login/signup?message= User exists')
    }
    else {
      console.log("user doesn't exist");
      client.query('INSERT INTO espnuser(username, password, level, localpreference, sportpreference) VALUES($1, $2, $3, $4, $5)', [req.body.username, password, req.body.level, req.body.location, req.body.sportpreference], function(err,result){
        if(err){
          console.log("unable to query INSERT");
          next(err);
        }
        console.log("We created your account, ", result.rows[0]);
        res.redirect('/login/signup?message= We created your account successfully!')
      });
    }
  });
});

router.get('/settings', function(req, res, next) {
  res.sendFile(path.join(__dirname,'..', 'public','settings.html'));
});
router.post('/settings', function(req, res, next){
  client.query('Select * FROM espnuser WHERE username =$1', [req.user.username], function(err, result){
    if(err){
      console.log("Unable to query SELECT")
      next(err);
    }
    console.log("Successful catch", result.rows[0]);
    client.query('UPDATE espnuser SET level = $1 WHERE username = $2', [req.body.level, req.user.username], function(err){
      if(err){
        console.log("Unable to query UPDATE")
        next(err);
      }   
      else{client.query('UPDATE espnuser SET localpreference = $1 WHERE username = $2', [req.body.location, req.user.username], function(err){
        if(err){
          console.log("Unable to query UPDATE")
          next(err);
        }   
        else{
          client.query('UPDATE espnuser SET sportpreference = $1 WHERE username = $2', [req.body.sportpreference, req.user.username], function(err){
            if(err){
              console.log("Unable to query UPDATE")
              next(err);
            }   
            else{
                if(bcrypt.compareSync(req.body.curpassword, result.rows[0].password)){
                  console.log("Retrieved current password")
                  if(req.body.password1 == req.body.password2){
                    var salt = bcrypt.genSaltSync(10);
                    var newpassword = bcrypt.hashSync(req.body.password1, salt);
                    client.query('UPDATE espnuser SET password = $1 WHERE username = $2', [newpassword, req.user.username], function(err){
                      if(err){
                        console.log("Unable to query UPDATE")
                        next(err);
                      }
                      else{
                        console.log("Changes successfully made!")
                        res.redirect('/login/settings?message= Changes made successfully')
                      }
                    });
                  }
                  else{
                    console.log("Passwords don't match")
                    res.redirect('/login/settings?message= Passwords dont match, no change made to password!')
                  }
                }
                else{
                  console.log("Current password incorrect")
                  res.redirect('/login/settings?message= Current password incorrect, no change made to password!')
                }
            }
          });
        }
      });    
      }
    });
  });  
});
 

// localhost:3000/login
router.post('/',
  passport.authenticate('local', { failureRedirect: 'login?message=Incorrect+credentials', failureFlash:true }),
  function(req, res, next) {
    console.log
    if(req.user.localpreference == 'NY'){
      if (req.user.level == 'casual'){
        if(req.user.sportpreference == 'Soccer'){
          res.redirect('/login/casual/Soccer')
        } 
        if(req.user.sportpreference == 'NFL'){
          res.redirect('/login/casual/NFL')
        }
        if(req.user.sportpreference == 'NBA'){
          res.redirect('/login/casual/NBA')
        }
        if(req.user.sportpreference == 'NHL'){
          res.redirect('/login/casual/NHL')
        }
        if(req.user.sportpreference == 'MLB'){
          res.redirect('/login/casual/MLB')
        }
        if(req.user.sportpreference == 'Golf'){
          res.redirect('/login/casual/Golf')
        }
      }
      if (req.user.level == 'pro'){
        if(req.user.sportpreference == 'Soccer'){
          res.redirect('/login/pro/Soccer')
        } 
        if(req.user.sportpreference == 'NFL'){
          res.redirect('/login/pro/NFL')
        }
        if(req.user.sportpreference == 'NBA'){
          res.redirect('/login/pro/NBA')
        }
        if(req.user.sportpreference == 'NHL'){
          res.redirect('/login/pro/NHL')
        }
        if(req.user.sportpreference == 'MLB'){
          res.redirect('/login/pro/MLB')
        }
        if(req.user.sportpreference == 'Golf'){
          res.redirect('/login/pro/Golf')
        }
      }
      if (req.user.level == 'rookie'){
        if(req.user.sportpreference == 'Soccer'){
          res.redirect('/login/rookie/Soccer')
        } 
        if(req.user.sportpreference == 'NFL'){
          res.redirect('/login/rookie/NFL')
        }
        if(req.user.sportpreference == 'NBA'){
          res.redirect('/login/rookie/NBA')
        }
        if(req.user.sportpreference == 'NHL'){
          res.redirect('/login/rookie/NHL')
        }
        if(req.user.sportpreference == 'MLB'){
          res.redirect('/login/rookie/MLB')
        }
        if(req.user.sportpreference == 'Golf'){
          res.redirect('/login/rookie/Golf')
        }
      }
  }
  if(req.user.localpreference == 'MA'){
    if (req.user.level == 'casual'){
      if(req.user.sportpreference == 'Soccer'){
        res.redirect('/login/casual/Soccer')
      } 
      if(req.user.sportpreference == 'NFL'){
        res.redirect('/login/casual/NFL1')
      }
      if(req.user.sportpreference == 'NBA'){
        res.redirect('/login/casual/NBA1')
      }
      if(req.user.sportpreference == 'NHL'){
        res.redirect('/login/casual/NHL1')
      }
      if(req.user.sportpreference == 'MLB'){
        res.redirect('/login/casual/MLB1')
      }
      if(req.user.sportpreference == 'Golf'){
        res.redirect('/login/casual/Golf')
      }
    }
    if (req.user.level == 'pro'){
      if(req.user.sportpreference == 'Soccer'){
        res.redirect('/login/pro/Soccer')
      } 
      if(req.user.sportpreference == 'NFL'){
        res.redirect('/login/pro/NFL1')
      }
      if(req.user.sportpreference == 'NBA'){
        res.redirect('/login/pro/NBA1')
      }
      if(req.user.sportpreference == 'NHL'){
        res.redirect('/login/pro/NHL1')
      }
      if(req.user.sportpreference == 'MLB'){
        res.redirect('/login/pro/MLB1')
      }
      if(req.user.sportpreference == 'Golf'){
        res.redirect('/login/pro/Golf1')
      }
    }
    if (req.user.level == 'rookie'){
      if(req.user.sportpreference == 'Soccer'){
        res.redirect('/login/rookie/Soccer')
      } 
      if(req.user.sportpreference == 'NFL'){
        res.redirect('/login/rookie/NFL1')
      }
      if(req.user.sportpreference == 'NBA'){
        res.redirect('/login/rookie/NBA1')
      }
      if(req.user.sportpreference == 'NHL'){
        res.redirect('/login/rookie/NHL1')
      }
      if(req.user.sportpreference == 'MLB'){
        res.redirect('/login/rookie/MLB1')
      }
      if(req.user.sportpreference == 'Golf'){
        res.redirect('/login/rookie/Golf')
      }
    }
  }
  else{
    if (req.user.level == 'casual'){
      if(req.user.sportpreference == 'Soccer'){
        res.redirect('/login/casual/Soccer')
      } 
      if(req.user.sportpreference == 'NFL'){
        res.redirect('/login/casual/NFL')
      }
      if(req.user.sportpreference == 'NBA'){
        res.redirect('/login/casual/NBA')
      }
      if(req.user.sportpreference == 'NHL'){
        res.redirect('/login/casual/NHL')
      }
      if(req.user.sportpreference == 'MLB'){
        res.redirect('/login/casual/MLB')
      }
      if(req.user.sportpreference == 'Golf'){
        res.redirect('/login/casual/Golf')
      }
    }
    if (req.user.level == 'pro'){
      if(req.user.sportpreference == 'Soccer'){
        res.redirect('/login/pro/Soccer')
      } 
      if(req.user.sportpreference == 'NFL'){
        res.redirect('/login/pro/NFL')
      }
      if(req.user.sportpreference == 'NBA'){
        res.redirect('/login/pro/NBA')
      }
      if(req.user.sportpreference == 'NHL'){
        res.redirect('/login/pro/NHL')
      }
      if(req.user.sportpreference == 'MLB'){
        res.redirect('/login/pro/MLB')
      }
      if(req.user.sportpreference == 'Golf'){
        res.redirect('/login/pro/Golf')
      }
    }
    if (req.user.level == 'rookie'){
      if(req.user.sportpreference == 'Soccer'){
        res.redirect('/login/rookie/Soccer')
      } 
      if(req.user.sportpreference == 'NFL'){
        res.redirect('/login/rookie/NFL')
      }
      if(req.user.sportpreference == 'NBA'){
        res.redirect('/login/rookie/NBA')
      }
      if(req.user.sportpreference == 'NHL'){
        res.redirect('/login/rookie/NHL')
      }
      if(req.user.sportpreference == 'MLB'){
        res.redirect('/login/rookie/MLB')
      }
      if(req.user.sportpreference == 'Golf'){
        res.redirect('/login/rookie/Golf')
      }
    }
}
});

// localhost:3000/login/rookie
router.get('/rookie/Soccer', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/rookie','Soccer.html'));
});
router.get('/rookie/NHL', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/rookie','NHL.html'));
});
router.get('/rookie/NBA', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/rookie','NBA.html'));
});
router.get('/rookie/NHL1', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/rookie','NHL1.html'));
});
router.get('/rookie/NBA1', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/rookie','NBA1.html'));
});
router.get('/rookie/Golf', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/rookie','Golf.html'));
});
router.get('/rookie/NFL', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/rookie','NFL.html'));
});
router.get('/rookie/MLB', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/rookie','MLB.html'));
});
router.get('/rookie/NFL1', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/rookie','NFL1.html'));
});
router.get('/rookie/MLB1', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/rookie','MLB1.html'));
});
// localhost:3000/login/casual
router.get('/casual/Soccer', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/casual','Soccer.html'));
});
router.get('/casual/NHL', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/casual','NHL.html'));
});
router.get('/casual/NBA', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/casual','NBA.html'));
});
router.get('/casual/NHL1', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/casual','NHL1.html'));
});
router.get('/casual/NBA1', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/casual','NBA1.html'));
});
router.get('/casual/Golf', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/casual','Golf.html'));
});
router.get('/casual/NFL', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/casual','NFL.html'));
});
router.get('/casual/MLB', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/casual','MLB.html'));
});
router.get('/casual/NFL1', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/casual','NFL1.html'));
});
router.get('/casual/MLB1', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/casual','MLB1.html'));
});
// localhost:3000/login/pro
router.get('/pro/Soccer', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/pro','Soccer.html'));
});
router.get('/pro/NHL', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/pro','NHL.html'));
});
router.get('/pro/NBA', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/pro','NBA.html'));
});
router.get('/pro/NHL1', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/pro','NHL1.html'));
});
router.get('/pro/NBA1', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/pro','NBA1.html'));
});
router.get('/pro/Golf', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/pro','Golf.html'));
});
router.get('/pro/NFL', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/pro','NFL.html'));
});
router.get('/pro/MLB', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/pro','MLB.html'));
});
router.get('/pro/NFL1', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/pro','NFL1.html'));
});
router.get('/pro/MLB1', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public/pro','MLB1.html'));
});


module.exports = router;