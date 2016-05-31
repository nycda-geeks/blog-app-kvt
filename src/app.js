//requiring modules
var Sequelize = require ('sequelize');
var express = require ('express');
var bodyParser = require('body-parser');
var session = require ('express-session');


//connect to database blog_app
var sequelize = new Sequelize ('blog_app', 'postgres', 'kyle1993' ,{
  host: 'localhost',
  dialect: 'postgres',
});
//Creating a new table called user
var User = sequelize.define('user', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING
});
//Creating a new table called post
var userPost = sequelize.define('message', {
  title: Sequelize.STRING,
  message: Sequelize.STRING
});
// Made sure User can have multiple messages but a message posted can have only one user
User.hasMany(userPost);
userPost.belongsTo(User);

var app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use (session({
    secret: 'secret secret',
    resave: true,
    saveUninitialized: false

}));


app.set('views', 'src/views');
app.set('view engine', 'ejs');

app.get('/', function ( req, res ){
  console.log('Index is displayed on localhost')
	res.render('index')
});

app.get('/newUser', function ( req, res ){
  console.log('Registration page is displayed on localhost')
	res.render('newUser')
});



sequelize.sync().then(function () {
	var server = app.listen(3000, function () {
		console.log('Example app listening on port: ' + server.address().port);
	});
});
