var UserModel = require('mongoose').model('User'),
      encrypt = require('../common/crypto/encrypt');

exports.getUsers = function(req, res){
  UserModel.find({}).exec(function(err, collection){
    res.send(collection);
  });
}

exports.createUser = function(req, res, next){
  var newUser = req.body;
  newUser.email = req.body.email.toLowerCase();
  newUser.username = req.body.username.toLowerCase();

  var salt = encrypt.createSalt();
  var hashedPwd = encrypt.hashPwd(salt, newUser.password);
  newUser.salt = salt;
  newUser.hashed_pwd = hashedPwd;

  newUser.firstname = "";
  newUser.lastname = "";

  UserModel.create(newUser, function(err, newUser){
    if(err){
      if(err.toString().indexOf('E11000') > -1){
        err = new Error('There already is a user with the same username!');
      }
      res.status(400);
      res.send({reason: err.toString()});
    }
    req.logIn(newUser, function(err){
      if(err) {return next(err);}
      res.send(newUser);
    })
  })
}

exports.updateUser = function(req, res){
  var userData = req.body;

  if(userData._id != req.user._id && !req.user.hasRole('admin')){
    res.status(403);
    return res.end();
  }
  req.user.firstname = userData.firstname;
  req.user.lastname = userData.lastname;
  req.user.email = userData.email;
  req.user.username = userData.username;

  if(userData.password && userData.password.length > 0){
    req.user.salt = encrypt.createSalt();
    req.user.hashed_pwd = encrypt.hashPwd(req.user.salt, userData.password);
  }
  req.user.save(function(err){
    if(err){
      res.status(400);

      return res.send({reason:err.toString()});
    }
    res.send(req.user);
  });
};