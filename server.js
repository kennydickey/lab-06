'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());

//-------------------------

app.get('/location', (request, response) => {
  response.send('hello');
})



// search query where??



app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})



