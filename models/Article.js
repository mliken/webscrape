// Require mongoose
var mongoose = require("mongoose");
//Create Schema class
var Schema = mongoose.Schema;

//create article schema
var ArticleSchema = new Schema({
	//title is a required string
	title:{
	type: String,
	required:true
	},
//link is required string
link:{
type: String,
required:true
},

//saves notes ObjectId, refers to the note model
note:{
	type:Schema.Types.ObjectId,
	ref:"Note"
}
});

//Create the Article model with ArticleSchema
var Article=mongoose.mode("Article", ArticleSchema);

//export the model
module.exports = Article;
