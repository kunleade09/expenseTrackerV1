const express = require("express");
const app = express();
const methodOverride = require('method-override');
const routes = require('./routes/routes');

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', routes);


// app.listen(3000, () => {
//     console.log("server is running on port 3000")
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
