// adding code to read and set any environment variables with the dotenv package:
require("dotenv").config();
var axios = require("axios");
var inquirer = require("inquirer");
var fs = require("fs");
var moment = require("moment");

// add the code required to import the keys.js file and store it in a variable.
var keys = require("./keys.js");

// import Spotify
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);


// Giving the user options
inquirer
    .prompt([
        {
            type: "list",
            message: "What Would You Like To Ask About: Concerts, Spotify Songs, Movies?",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "choice"
        },
    ])
    // concert this
    .then(function (res) {
        if (res.choice === "concert-this") {
            console.log("Welcome");
            // Ask about an artist
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What Artist Interests You?",
                        name: "artist"
                    }
                ]).then(function (result) {
                    let artist = result.artist;
                    // calling Bands in Town API
                    let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
                    // getting results from API
                    if (result.artist == "") {
                        console.log("Please, enter an artist");
                    } else {
                        axios.get(queryUrl).then(
                            function (response) {
                                // loop through the response data info
                                for (let i = 0; i < response.data.length; i++) {
                                    // convert date with moment()
                                    let date = moment(response.data[i].datetime).format('MM/DD/YYYY')
                                    console.log("\n=================");
                                    console.log("Venue: " + response.data[i].venue.name);
                                    console.log("City: " + response.data[i].venue.city);
                                    console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"));
                                    console.log("=================");
                                }
                            }
                        )
                    }
                })
        } else if (res.choice === "spotify-this-song") {
            console.log("\n=================");
            console.log("Welcome");
            console.log("\n=================");
            //asking about Spotify
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What Track Interests You?",
                        name: "track"
                    }
                ])
                .then(function (result) {
                    if (result.track === "") {
                        result.track = "The Sign, Ace of Base";
                        spotify
                            .search({ type: 'track', query: result.track, limit: 10 })
                            .then(function (response) {
                                console.log("\n=================");
                                console.log("\n=================");
                                console.log("Artist: " + response.tracks.items[0].artists[0].name);
                                console.log("Song: " + response.tracks.items[0].name);
                                console.log("URL: " + response.tracks.items[0].preview_url);
                                console.log("Album: " + response.tracks.items[0].album.name);
                                console.log("\n=================");
                            })
                    }
                })

        }
    })


// store api link and concatenate with the movieName
// var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

// axios.get takes in a url
// use .then() to run our callback when the api call is successful
// axios.get(queryUrl).then(
//     if(movieName === undefined) {

//     }
//     function(response) {
//       console.log("Title of The Movie: " + response.data.Title);
//       console.log("Year The Movie Came Out: " + response.data.Year);
//       console.log("IMDB Rating of The Movie: " + response.data.imdbRating);
//       console.log("Rotten Tomatoes Rating of The Movie: " + response.data.Ratings[1].Value);
//       console.log("Country Where The Movie Was Produced: " + response.data.Country);
//       console.log("Language  of The Movie: " + response.data.Language);
//       console.log("Plot of The Movie: " + response.data.Plot);
//       console.log("Actors in The Movie: " + response.data.Actors);
//     }) 