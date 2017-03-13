// a GET request to scrape echojs website
app.get("/scrape", function (req, res){
// grabbing html with request
request("http://www.echojs.com/", function(error, response, html){
//load into cheerio and save it to $ for a shorthand selector
var $ = cheerio.load(html);
//we grab every h2 within an article tag and do the following:
$("article h2").each(function(i, element){

//save an empty result object
var result = {};

//Add text and href of each link and save them as properties of the result object

result.title = $(this).children("a").text();
result.link = $(this).children("a").attr("href");

//Using Article model, create a new entry
//this passeses the result object to the entry and the titel link

var entry = new Article(result);

//now saving the entry to db
entry.save(function(err,doc){
	//log the errors
	if (err){
		console.log(err);
	}
	//or log teh doc
	else{
		console.log(doc);
	}

});
});
});

//Tell browser the scraping is complete
res.send("Scrape Complete");
});

//This will get the articles we scarped from mongoDB
app.get("/articles", function(req, res){
//grab every doc in the Articles array
Article.find({}, function(error,doc){
	//log the errors
	if (error){
		console.log(error);
	}
	//or send the doc to the browser as a json object
	else{
		res.json(doc);
	}
});
});

//Grab article by ObjectID
app.get("/articles/:id", function(req, res){
	//creat a new note and pass the req.body to the entry
	var newNote = new Note(req.body);
//and save the new note the db
newNote.save(function(error, doc){
	//log the errors
	if (error){
		console.log(error);
	}
	//otherwise
	else{
	//use article id to find and update note
	Article.findOneAndUpdate({"_id": req.params.id}, {"note: doc_id"})
	//execute query
	.exec(function(err,doc){
		//log errors
		if (err){
			console.log(err);
		}
		else{
			//or send teh doc to browser
			res.send(doc);
		}
	});
}
});
});