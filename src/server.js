const knex = require("./db/connection");
const express = require('express')
const app = require('./app.js')
const router = express.Router()
const PORT = process.env.PORT || 5000;

app.use('/', router);

knex.migrate
  .latest()
  .then((migrations)=> {
    console.log("migrations", migrations[0])
   
    app.listen(PORT, () => console.log(`Server running on ${PORT} `))
  })
  .catch(console.error);
module.exports = app