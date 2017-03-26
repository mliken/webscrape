//server routes

//Bring in the Scrape function from our scripts directory
var scrape = require("../scripts/scrape");

//bring headline and notes from the controller
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function(router){
//this route renders the homepage
router.get("/", function(req, res){
	res.render("home");
});

//this route renders the saved handlebars page
router.get("/saved", function(req, res){
	res.render("saved");
});

//this route handles scraping more articles to add to our db
router.get("/api/fetch", function(req, res){

//This method inside the headlines controller wil try and scrape new articles
//and save unique ones to our database
headlinesController.fetch(function(err,docs)
{
//if we dont get any articles back, likely because there are no no new unique artaicles
if (!docs || docs.insertedCount ===0){
	res.json({
		message: "No new articles today. Check back tomorrow!"
	});
	}
	//otherwise send back a count of how many new articles we got 
	else {
		res.json({
			message:"Added" + docs.insertedCount +
			" new articles!"
		});
	}
});
});
//this route handles getting all headlines from our database
router.get("/api/headlines", function(req,res)
{
	//if teh client specifies a saved query paramter, ie "/api/headlines/?saved=true"
	//which is translated to just { saved: true} on req.query,
	//then set the query object equal to this
	var query = {};
	if (req.query.saved){
		query = req.query;
	}
	// run the headlinesController get method and pass in whether we weant saved, unsaved, 
	//or all headlines by deault)
	headlinesController.get(query, function(data)
{
	//sends the article datab back as JSON
	res.json(data);
});
});

//this route handles deleting a specified headline
router.delete("/api/headlines/:id", function(req, res){
	var query = {};
	//set the _id property of the query object to the id in req.params
	query._id = req.params.id;

	//run the headlinesController delete method and pass in our query object containing 
	//the id of the headline we want to delete
	headlinesController.delete(query, function (err, data){
		//send the result back as JSON to be handled client side
		res.json(data);
	});
});

//this route handles updating a headline in particular saving one
router.patch("/api/headlines", function(req, res)
{
//construct a query object to send to the headlinesController with the id of the headline to be saved

//we're using req.body here instead of req.params to make this route easier to change if we wever want to update a headline in any way except saving it

headlinesController.update(req.body, function(
	err,data ){
	//after completion send the result back to the user
	res.json(data);
});
});
//this route handles getting notes for a particular headline id
router.get("/api/notes/:headline_id?", function(req, res){
	//if we are supplied a headline id in req,params, then we will add the id to our query project
	//otherwise querly will remain an empty object and thu s return every note
	var query = {};
	if(req.params.headline_id){
		query._id = req.params.headline_id;
	} 
	//get all notes taht match our query using the notesController get method
	notesController.get(query, function(err,data)
{
	//send the note back back to the user as JSON
	res.json(data);
});
});
//this route handles deleting a ntoe of a particular node id
router.delete("/api/notes/:id", function(req, res){
	var query = {};
	query._id = req.params.id;

	//use the check function from the headlines controller
	// this checks all our articles, sorted by id number
	notesController.delete(query, function(err,data){
		//send the artice data to a json
		res.json(data);
	});
});

//this routes handles saving a new note
router.post("/api/notes", function(req, res){
	notesController.save(req.body, function(data)
	{
		//send the note to the browser as json
		res.json(data);

	});
});
};