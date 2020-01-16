'use strict';

const express = require('express');
require('dotenv').config();
const superagent = require('superagent')
//npm i -S superagent
const cors = require('cors');
// const pg = require('pg');
// const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', err => console.error(err));

const PORT = process.env.PORT || 3001;
const app = express(); //our server (as a file)

app.use(cors());

// app.get('/add', (request, response) => {
// let firstName = request.query.first;
// let lastName = request.query.last;
// let search_query = new Location(city);
// let formatted_query = locData.display_name;
// let latitude = locData.lat;
// let longitude = locData.lon;
// let safeValues = [city, lat, lon];
// client.query(SQL, safeValues)
//   .then( results => {
//     response.status(200).json(results);
//   })
//   .catch( error => errorHandler(error) );
// });
// console.log('firstName: ', firstName);
// console.log('flastName: ', lastName);

// let sql = 'INSERT INTO people (last_name)'


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
    //get skyData from geo.json
    // const skyData = require('./data/darksky.json');
    //create our own query string
    // let getWeather = skyData.daily.data;
    // console.log(getWeather); //uncomment to see data
    // const getDailyWeather = []
    // for(let i = 0; i < getWeather.length; i++){
    //   getDailyWeather.push(new Forecast(getWeather[i]));
    // }
    // const getDailyWeather = getWeather.map(function(element) {
    //   return new Forecast(element);
    // });
    let {latitude, longitude} = request.query;
    //get results from darksky to send to frontend
    let url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`;

    superagent.get(url)
      .then(superagentResults => {
        const weatherArray = superagentResults.body.daily.data.map(day => {
          return new Forecast(day)
        })
        response.status(200).send(weatherArray)
      })
  }
  catch(error){
    errorHandler('we messed up', request, response)
  }
})

// //constructor
function Forecast(skyResults){
  this.forecast = skyResults.summary;
  this.time = skyResults.time;
}

//events-----------------------------------
// app.get('/events', (request, response) => {
//   try{
    



//----------------------------------------------

app.use('*', notFoundHandler);
app.use(errorHandler);


function notFoundHandler(request, response) {
  response.status(404).send('this route does not exist');
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}
//after all other routes
// app.get('*', (request, response) => {
//   response.status(404).send('this route does not exist');
// })
//turn on server
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})



// client.connect()
//   .then(app.listen(PORT, () => console.log(`listening on port: ${PORT}`)))
//   .catch((err) => console.error(err));



