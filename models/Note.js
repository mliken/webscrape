//require mongoose
var mongoose = require("mongoose");
//create a schema
var Schema = mongoose.Schema;

//creat the Note schema
var NoteSchema = new Schema({
//string
title:{
type: String
},
body:{
type: String
}
});

//Mongoose will auto save the ObjectId notes

//Creating note model w/ note schema
var Note = mongoose.model("Note", NoteSchema);

//export the note model
module.exports = Note;
