const express = require('express')
const ejs = require("ejs");


const app = express();
app.use(express.json());

app.set('view engine', 'ejs');

require('./routes/twitter')(app)

app.listen(5000, (req, res) => {
    console.log('server is running on port 5000')
})