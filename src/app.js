//requiring modules
var Sequelize = require ('sequelize');
var express = require ('express');
var bodyParser = require('body-parser');
var session = require ('express-session');
var pg = require ( 'pg' );
var app = express();
var fs = require ('fs');

app.use(bodyParser.urlencoded({extended: true}));

//connect to database blog_app
var sequelize = new Sequelize ('blogdata', 'postgres', 'kyle1993' ,{
  host: 'localhost',
  dialect: 'postgres',
});
//start session
app.use (session({
    secret: 'secret secret',
    resave: true,
    saveUninitialized: false
}));

//Creating a new table called users
var User = sequelize.define('user', {
  userName: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING
});

//Creating a new table called messages
var Message = sequelize.define('message', {
  title: Sequelize.TEXT,
  message: Sequelize.TEXT
});

//Creating a new table called comments
var userComment = sequelize.define('comment', {
  body: Sequelize.STRING,
});

// Made sure User can have multiple messages but a message posted can have only one user
User.hasMany(Message);
Message.belongsTo(User);
Message.hasMany(userComment);
User.hasMany(userComment);
userComment.belongsTo(User);
userComment.belongsTo(Message);


//set view engine and views
app.set('views', 'src/views');
app.set('view engine', 'pug');
//display index page
app.get('/', function ( req, res ){
  console.log('Index is displayed on localhost');
	res.render('index');
});
//verify logindata user
app.post('/login', function ( req, res ) {
  if (req.body.loginEmail.length === 0){
		res.redirect('/?message=' + encodeURIComponent(("Please fill out your username.")));
		return;
	}
	if (req.body.loginPassword.length === 0){
		res.redirect('/?message=' + encodeURIComponent(("Please fill out your password.")));
		return;
	}
  User.findOne({
    where: {
          email : req.body.loginEmail
        }
  }).then(function (user){
    if ( user !== null && req.body.loginPassword === user.password){
      req.session.user = user;
      console.log(user.id)
      res.redirect('/profile');
    } else {
      res.redirect ('newUser')
      console.log('nope no user found with that combination')

    }
  })

})
// display registration page
app.get('/newUser', function ( req, res ){
  console.log('Registration page is displayed on localhost');
	res.render('newUser');
});
// push user info to database
app.post('/register', function( req, res ){
  User.create({
    userName: req.body.userName,
    email: req.body.userEmail,
    password: req.body.userPassword
  }).then(function(){
    res.redirect('/profile');
});
});
// display profile with all messages posted by user
app.get('/profile', function(req, res){
  var user = req.session.user;
  console.log(user)
  if ( user === undefined){
    res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
  } else {
  Message.findAll({
    where:{ userId: user.id}
  }).then(function(messages){
    res.render('profile', {
        posts: messages


    })

  })
}
});
//Post message
app.post('/profile', function ( req, res) {
    console.log(req.session.user);
  User.findOne({
    where: {
      id: req.session.user.id
    }
  }).then(function(theuser){
     theuser.createMessage({
       title: req.body.title,
       message: req.body.message
     })
  }).then(function () {
    res.redirect('/profile')
  })

})

app.get('/allPosts', (req, res)=>{
  Message.findAll({

  }).then(function(messages){
    res.render('allPosts',{
      posts: messages
    }
  )
  })
})

app.get('/logout', (req, res)=> {
  console.log('User is logged out')
  req.session.destroy(function(error){
    if(error){
      throw error;
    }
    res.redirect('/?/message=' + encodeURIComponent("Succesfully logged out!"));
  });
});

sequelize.sync({force: false}).then(function () {
	var server = app.listen(3000, function () {
		console.log('Example app listening on port: ' + server.address().port);
	});
});
