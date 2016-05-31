var Sequelize = require ('sequelize');
var express = require ('express');
var bodyParser = require('body-parser');
var session = require('express-session');



var sequelize = new Sequelize ('Blog_app', 'postgres', kyle1993 ,{
  host: 'localhost',
  dialect: 'postgres',
  define: {
    timestamps: true
  }
});

var User = sequelize.define('user', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING
});

var app = express();

app.use (express.static( 'resources' ));

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.get('/', function(req, res){
  console.log('Index is loaded to localhost')
	res.render('index');
});



app.listen(3000, function() {
	console.log( ' Your cookies are ready on port 3000 ' )
});
