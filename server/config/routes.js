var auth = require('./auth'),
    mongoose = require('mongoose'),
    UserModel = mongoose.model('User'),
    users = require('../controllers/users'),
    hubs = require('../controllers/hubs');

module.exports = function(app){
  //this will look in the public/app directory and process the files as jade templates
  // app.get('/admin/users', users)

  app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
  app.post('/api/users', users.createUser);
  app.put('/api/users', users.updateUser);
  app.post('/getUserDetails', users.getUserDetails);
  app.delete('/api/users/:id', users.deleteUser);

  app.get('/api/hubs', hubs.getHubs);
  // auth.requiresRole('admin'),
  app.get('/api/hubs/:username', auth.apiLogin, hubs.getUserHubs);
  app.post('/getHubDetails', hubs.getHubDetails);
  app.post('/api/hubs', hubs.createHub);
  app.delete('/api/hubs/:id', hubs.deleteHub);
  app.put('/api/hubs/', hubs.updateHub);

  app.post('/api/hubusers', hubs.createHubUser);

  app.get('/partials/*', function(req, res){
    res.render('../../public/app/' + req.params[0]);
  });
  app.post('/login', auth.authenticate);
  app.post('/logout', function(req, res){
    //this was added by the passport module
    req.logout();
    res.end();
  });
  app.get('*', function(req, res){
    res.render('index',{
      bootstrappedUser: req.user,
      clientID: req.sessionID
    });
  });
}
