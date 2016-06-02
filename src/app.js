//requiring modules
var Sequelize = require ('sequelize');
var express = require ('express');
var bodyParser = require('body-parser');
var session = require ('express-session');
var pg = require ( 'pg' );
var app = express();

app.use(bodyParser.urlencoded({extended: true}));

//connect to database blog_app
var sequelize = new Sequelize ('blogdata', 'postgres', 'kyle1993' ,{
  host: 'localhost',
  dialect: 'postgres',
});

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



app.set('views', 'src/views');
app.set('view engine', 'ejs');

app.get('/', function ( req, res ){
  console.log('Index is displayed on localhost');
	res.render('index');
});

app.post('/login', function ( req, res ) {
  User.findOne({
    where: {
          email : req.body.loginEmail
        }
  }).then(function (user){
    if ( user !== null && req.body.userPassword === user.loginPassword){
      req.session.user = user;
      console.log(user.id)
      res.redirect( '/profile')
    } else {
      console.log('nope no user found with that combination')

    }
  })

})

app.get('/newUser', function ( req, res ){
  console.log('Registration page is displayed on localhost');
	res.render('newUser');
});

app.post('/register', function( req, res ){
  User.create({
    userName: req.body.userName,
    email: req.body.userEmail,
    password: req.body.userPassword
  }).then(function(){
    res.render('profile');
});
});

app.get("/profile", function( req, res){
  User.findOne({
    where: {
          id: req.session.user.id
    }
  })
  console.log('Profile page is displayed on localhost');
  res.render('profile');
});

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
    //  Message.create({
    //    title: req.body.Title,
    //    message: req.body.Message
    //  })
  }).then(function () {
    res.redirect('/profile')
  })

})


sequelize.sync({force: false}).then(function () {
	var server = app.listen(3000, function () {
		console.log('Example app listening on port: ' + server.address().port);
	});
});
