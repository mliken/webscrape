var request = require("request");
var cheerio = require("cheerio");
// Requiring our Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var ArticleAll = require("../models/ArticleAll.js");

var controller = {
    // cb: function(res) {
    //     res.redirect("/showAllArticle");
    // },
    createArticle: function(res, cb) {
        cb();

    },
    scrapeArticle: function(req, res) {

        request('http://www.nytimes.com', function(error, response, html) {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(html);

            // An empty array to save the data that we'll scrape


            // Select each instance of the HTML body that you want to scrape
            // NOTE: Cheerio selectors function similarly to jQuery's selectors, 
            // but be sure to visit the package's npm page to see how it works
            $('h2.story-heading').each(function(i, element) {


                // Save an empty result object
                var result = {};

                result.title = $(element).children().text();
                result.link = $(element).children().attr("href");

                var entry = new ArticleAll(result);


                ArticleAll.findOne({ "title": result.title }, function(error, data) {
                    // Log any errors
                    if (error) {
                        console.log(error);
                    }
                    // Or send the doc to the browser as a json object
                    else if (data == null) {

                        console.log("inside null");


                        // Now, save that entry to the db
                        entry.save(function(err, doc) {
                            console.log("inside save");
                            // Log any errors
                            if (err) {
                                console.log(err);
                            }
                            // Or log the doc
                            else {
                                console.log(doc);

                            }
                        });

                    }
                });


            })



        })
        res.render("success");
    },

    showAllArticle: function(req, res) {

        ArticleAll.find({}, function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Or send the doc to the browser as a json object
            else {
                var resultFound = {
                        article: doc
                    }
                    //res.json(doc);
                res.render("all", resultFound);
            }
        });



    },

    showArticle: function(req, res) {
        // Article.find({}, function(error, doc) {
        //     // Log any errors
        //     if (error) {
        //         console.log(error);
        //     }
        //     // Or send the doc to the browser as a json object
        //     else {
        //         res.json(doc);
        //     }
        // });

        Article.find({})
            // ..and populate all of the notes associated with it
            .populate("note")
            // now, execute our query
            .exec(function(error, doc) {
                // Log any errors
                if (error) {
                    console.log(error);
                }
                // Otherwise, send the doc to the browser as a json object
                else {
                    // console.log(doc);
                    var resultFound = {
                            article: doc
                        }
                        //res.json(doc);
                    res.render("index", resultFound);
                }
            });



    },

    associateNote: function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        Article.findOne({ "_id": req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            // now, execute our query
            .exec(function(error, doc) {
                // Log any errors
                if (error) {
                    console.log(error);
                }
                // Otherwise, send the doc to the browser as a json object
                else {
                    res.json(doc);
                }
            });

    },

    addNote: function(req, res) {
        console.log("inside add note");
        console.log(req.body);
        // Create a new note and pass the req.body to the entry
        var newNote = new Note(req.body);

        // And save the new note the db
        newNote.save(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise
            else {
                // Use the article id to find and update it's note

                Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "note": doc._id } }, function(err, newdoc) {
                    // Send any errors to the browser
                    if (err) {
                        res.send(err);
                    }
                    // Or send the newdoc to the browser
                    else {
                        res.redirect("/articles");
                    }
                });
            }
        });

    },

    deleteNote: function(req, res) {
        console.log("remove");
        console.log(req.body.noteId)
        Note.remove({ _id: req.params.id }, function(err) {
            if (!err) {
                res.redirect("/articles");
            } else {
                console.log(err);
            }
        });


    },

    saveArticle: function(req, res) {
        console.log("inside save")
        var entry = new Article(req.body);
        Article.findOne({ "title": req.body.title }, function(error, data) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Or send the doc to the browser as a json object
            else if (data == null) {

                console.log("inside null");


                // Now, save that entry to the db
                entry.save(function(err, doc) {
                    console.log("inside save");
                    // Log any errors
                    if (err) {
                        console.log(err);
                    }
                    // Or log the doc
                    else {
                        res.redirect("/articles");

                    }
                });

            } else {
                res.redirect("/articles");
            }
        });
    },

    deleteArticle: function(req, res) {
        console.log("remove");
        Article.remove({ _id: req.params.id }, function(err) {
            if (!err) {
                res.redirect("/articles");
            } else {
                console.log(err);
            }
        });


    },

}

module.exports = controller;