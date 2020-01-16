'use strict';

const express = require('express');
require('dotenv').config();
const superagent = require('superagent')
//npm i -S superagent
const cors = require('cors');


const PORT = process.env.PORT || 3001;
const app = express();  //our server (as a file)


app.use(cors());
//-------------------------

let locations = {};

//----------location--------------
app.get('/location', (request, response) => {
  try{
    // let city = request.query.city;
    // // console.log(city); //uncomment to see data
    // //pull geodata from geo.json
    // const geoData = require('./data/geo.json');

    // //first instance of geodata;
    // let geoDataResults = geoData[0];
    // let location = new Location(city, geoDataResults)
    // response.status(200).send(location);

    let city = request.query.city;
    let key = process.env.LOCATION_IQ_KEY;
    let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

    if (locations[url]){
      response.send(locations[url]);
    } else {
      superagent.get(url)
        .then(data => {
          const geoData = data.body[0];
          const location = new Location(city, geoData);
          locations[url] = location;
          response.status(200).send(location);
        })

    }
    // //after you get the json data
    //   .then(results => {
    //     console.log('i went to locationiq');
    //     console.log('results', results);
    //   })
  }
  catch(error){
    errorHandler('we messed up', request, response)
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
    let getWeather = skyData.daily.data;
    // console.log(getWeather); //uncomment to see data
    // const getDailyWeather = []
    // for(let i = 0; i < getWeather.length; i++){
    //   getDailyWeather.push(new Forecast(getWeather[i]));
    // }
    const getDailyWeather = getWeather.map(function(element) {
      return new Forecast(element);
    });


    //first instance of skyData;
    console.log(getDailyWeather)
    response.status(200).send(getDailyWeather);
  }
  catch(error){
    errorHandler('we messed up', request, response)
  }
})

app.use('*', notFoundHandler);
app.use(errorHandler);

// //constructor
function Forecast(skyResults){
  this.forecast = skyResults.summary;
  this.time = skyResults.time;
}

//----------------------------------------------

function notFoundHandler(request, response) {
  response.status(404).send('this route does not exist');
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

// search query where??


//can use response.send or response.redirect (for htmls)

//after all other routes
// app.get('*', (request, response) => {
//   response.status(404).send('this route does not exist');
// })
//turn on server
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})





