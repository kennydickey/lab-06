'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());

//-------------------------


//----------location--------------
app.get('/location', (request, response) => {
  try{
    let city = request.query.city;
    console.log(city);
    //pull geodata from geo.json
    const geoData = require('./data/geo.json');

    //first instance of geodata;
    let geoDataResults = geoData[0];
    let location = new Location(city, geoDataResults)
    response.status(200).send(location);
  }
  catch(error){
    errorHandler('we messed up', response)
  }
})

//constructor
function Location(city, locData){
  this.search_query = city;
  this.formatted_query = locData.display_name;
  this.latitude = locData.lat;
  this.longitude = locData.lon;
}

//weather-------------------------------------------

app.get('/weather', (request, response) => {
  try{
    //pull skyData from geo.json
    const skyData = require('./data/darksky.json');
    let skyArr = skyData.daily.data;
    console.log(skyArr);
    const newSkyArr = []
    for(let i = 0; i < skyArr.length; i++){
      newSkyArr.push(new Forecast(skyArr[i]));
    }
    //first instance of skyData;
    console.log(newSkyArr)
    response.status(200).send(newSkyArr);
  }
  catch(error){
    errorHandler('we messed up', response)
  }
})

// //constructor
function Forecast(skyResults){
  this.forecast = skyResults.summary;
  this.time = skyResults.time;
}

//----------------------------------------------

function errorHandler(string, response){
  response.status(500).send(string);
}

// search query where??



//can use response.send or response.redirect (for htmls)

//after all other routes
app.get('*', (request, response) => {
  response.status(404).send('this route does not exist');
})
//turn on server
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})





