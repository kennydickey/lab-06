'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());

//-------------------------



app.get('/location', (request, response) => {
  let city = request.query.city;
  console.log(city);
  const geoData = require('./data/geo.json');
  let geoDataResults = geoData[0];

  let location = {
    search_query: geoDataResults.place_id,
    formatted_query: geoDataResults.display_name,
    latitude: geoDataResults.lat,
    longitude: geoDataResults.lon
  }

  response.send(location);

})

// function Location(city, locData){
//   this.search_query = city;
//   this.formatted_query = locData[0].lat;
//   this.latitude = locData[0].lat;
//   this. longitude = locData[0].long
// }



// search query where??



app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})





