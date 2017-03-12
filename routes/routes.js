var controller = require("../controllers/controller.js");

module.exports = function(app) {



    app.get("/", function(req, res) {
        res.render("all");
    });
    app.get("/scrape", controller.scrapeArticle);

    app.get("/articles", controller.showArticle);
    app.get("/articlesAll", controller.showAllArticle);

    app.get("/articles/:id", controller.associateNote);
    app.post("/articles/:id", controller.addNote);
    app.post("/deleteNote/:id", controller.deleteNote);
    app.post("/saveArticle", controller.saveArticle);
    app.post("/deleteArticle/:id", controller.deleteArticle);

}