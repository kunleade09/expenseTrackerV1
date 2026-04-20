const express = require("express");
const app = express();
const methodOverride = require('method-override');
const routes = require('./routes/routes');

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', routes);


app.listen(3000, function(){
    console.log("server is running on port 3000")
});