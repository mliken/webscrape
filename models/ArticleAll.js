// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleAllSchema = new Schema({
    // title is a required string
    title: {
        type: String
            // ,required: true
    },
    // link is a required string
    link: {
        type: String
            // ,required: true
    }
});

// Create the Article model with the ArticleSchema
var ArticleAll = mongoose.model("ArticleAll", ArticleAllSchema);

// Export the model
module.exports = ArticleAll;