// adding code to read and set any environment variables with the dotenv package:
require("dotenv").config();

// add the code required to import the keys.js file and store it in a variable.
var keys = require("./keys.js");

// import the axios package
var axios = require("axios");

// store the 2nd index of the command line
var movieName = process.argv[2];

// store api link and concatenate with the movieName
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

console.log(queryUrl);

// axios.get takes in a url
// use .then() to run our callback when the api call is successful
axios.get(queryUrl).then(
    function(response) {
      console.log("Title of The Movie: " + response.data.Title);
      console.log("Year The Movie Came Out: " + response.data.Year);
      console.log("IMDB Rating of The Movie: " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating of The Movie: " + response.data.Ratings);
      console.log("Country Where The Movie Was Produced: " + response.data.Country);
      console.log("Language  of The Movie: " + response.data.Language);
      console.log("Plot of The Movie: " + response.data.Plot);
      console.log("Actors in The Movie: " + response.data.Actors);
    })