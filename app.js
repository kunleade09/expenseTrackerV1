require('dotenv').config();
const express = require("express");
const methodOverride = require('method-override');
const routes = require('./routes/routes');
const connectDB = require("./db")

connectDB();

const app = express();

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false })); // ← reads HTML form data
app.use(express.json()); 
app.use(express.static('public'));

app.use('/', routes);


// app.listen(3000, () => {
//     console.log("server is running on port 3000")
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
