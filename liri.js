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
            console.log("\nWelcome");
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
                        result.track = "The Sign, Ace of Base ";
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
                                //appending song to log.txt
                                fs.appendFile("log.txt", result.track, function (err) {
                                    // If an error was experienced we will log it.
                                    if (err) {
                                        console.log(err);
                                    }
                                    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                                    else {
                                        console.log(result.track + "added to log.txt file! ");
                                    }
                                });
                            })
                            .catch(function (err) {
                                console.log(err);
                            });
                    } else {
                        spotify
                            .search({ type: 'track', query: result.track })
                            .then(function (response) {
                                console.log("\n=================");
                                for (let i = 0; i < response.tracks.items.length; i++) {
                                    console.log("\n=================");
                                    console.log("Artist: " + response.tracks.items[0].artists[0].name);
                                    console.log("Song: " + response.tracks.items[0].name);
                                    console.log("URL: " + response.tracks.items[0].preview_url);
                                    console.log("Album: " + response.tracks.items[0].album.name);
                                    console.log("\n=================");
                                }
                                //appending song to log.txt
                                fs.appendFile("log.txt", result.track, function (err) {
                                    // If an error was experienced we will log it.
                                    if (err) {
                                        console.log(err);
                                    }
                                    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                                    else {
                                        console.log(result.track + " added to log.txt file!");
                                    }
                                });
                            })
                            .catch(function (err) {
                                console.log(err);
                            });
                    }

                })
            // Do what it says
        } else if (res.choice === "do-what-it-says") {
            fs.readFile("random.txt", "utf8", function (error, data) {
                // If the code experiences any errors it will log the error to the console.
                if (error) {
                    return console.log(error);
                }
                spotify
                    .search({ type: 'track', query: data })
                    .then(function (response) {
                        console.log("\n=================");
                        for (let i = 0; i < response.tracks.items.length; i++) {
                            console.log("\n=================");
                            console.log("Artist: " + response.tracks.items[i].artists[0].name);
                            console.log("Song: " + response.tracks.items[i].name);
                            console.log("URL: " + response.tracks.items[i].preview_url);
                            console.log("Album: " + response.tracks.items[i].album.name);
                            console.log("\n=================");
                        }
                        // appending movies to log.txt file
                        fs.appendFile("log.txt", data, function (err) {
                            // If an error was experienced we will log it.
                            if (err) {
                                console.log(err);
                            }
                            // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                            else {
                                console.log(data + " added to log.txt file!")
                            }
                        });
                    })
            })
        }
        // OMDB movie-this
        else if (res.choice === "movie-this") {
            console.log("\n=================");
            console.log("\nWelcome");
            console.log("\n=================");
            //asking about movie
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What Movie Interests You?",
                        name: "movie"
                    }
                ]).then(function (result) {
                    //if a user enters nothing then Mr Nobody
                    if (result.movie == "") {
                        // result.movie = "Mr.Nobody";
                        // console.log(result.movie);
                        // ombdMovie();
                        axios.get("http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy").then(
                            function (response) {
                                console.log("\n=================");
                                console.log("Title of The Movie: " + response.data.Title);
                                console.log("Year The Movie Came Out: " + response.data.Year);
                                console.log("IMDB Rating of The Movie: " + response.data.imdbRating);
                                console.log("Rotten Tomatoes Rating of The Movie: " + response.data.Ratings[1].Value);
                                console.log("Country Where The Movie Was Produced: " + response.data.Country);
                                console.log("Language  of The Movie: " + response.data.Language);
                                console.log("Plot of The Movie: " + response.data.Plot);
                                console.log("Actors in The Movie: " + response.data.Actors);
                                console.log("\n=================");
                            })
                        //appending Mr/Nobody to log file
                        fs.appendFile("log.txt", result.movie, function (err) {
                            // If an error was experienced we will log it.
                            if (err) {
                                console.log(err);
                            }
                            // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                            else {
                                console.log(result.movie + " added to log.txt file!");
                            }
                        });
                    }
                    else {
                        let ombdMovie = function () {
                            axios.get("http://www.omdbapi.com/?t=" + result.movie + "&y=&plot=short&apikey=trilogy").then(
                                function (response) {
                                    // if Error
                                    if (response.data.Error) {
                                        console.log("Movie Not Found!");
                                    }
                                    // if move found
                                    else if (result.movie) {
                                        console.log("\n=================");
                                        console.log("Title of The Movie: " + response.data.Title);
                                        console.log("Year The Movie Came Out: " + response.data.Year);
                                        console.log("IMDB Rating of The Movie: " + response.data.imdbRating);
                                        console.log("Rotten Tomatoes Rating of The Movie: " + response.data.Ratings[1].Value);
                                        console.log("Country Where The Movie Was Produced: " + response.data.Country);
                                        console.log("Language  of The Movie: " + response.data.Language);
                                        console.log("Plot of The Movie: " + response.data.Plot);
                                        console.log("Actors in The Movie: " + response.data.Actors);
                                        console.log("\n=================");
                                    }
                                })
                        }
                        ombdMovie();
                        // appending movies to log file
                        fs.appendFile("log.txt", result.movie , function (err) {
                        // If an error was experienced we will log it.
                            if (err) {
                                console.log(err);
                            }

                        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                            else {
                                console.log(result.movie + "added to log.txt file!");
                            }
                        });
                    }
                })
        }
    })
