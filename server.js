const express = require('express');
const app = express();
var path = require('path');
const bodyParser= require('body-parser');

const session =  require('express-session')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.get('/', function(req, res){
   
   res.render('helloWorld',{ 
      'kada': "uvijek"
   });

}); 



console.log("Running!");
app.listen(8080);