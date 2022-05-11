//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", function(req,res){
    Article.find(function(err, foundArticles){
        if(err){
            res.send(err);
        }
        else{
            res.send(foundArticles);
        }
    });
});

app.post("/articles", function(req,res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(err){
            res.send(err);
        }
        else{
            res.send("Successfully added the new Article");
        }
    })
});

app.delete("/articles", function(req,res){
    Article.deleteMany(function(err){
        if(err){
            res.send(err);
        }
        else{
            res.send("Successfully deleted all the articles");
        }
    });
});

app.get("/articles/:articleTitle", function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(err){
            res.send(err);
        }
        else if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("Article not found");
        }
    });
});

app.put("/articles/:articleTitle", function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send("Succesfully completed the task");
            }
        }
    );
});

app.patch("/articles/:articleTitle", function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send("Succesfully completed the task");
            }
        }
    );
});

app.delete("/articles/:articleTitle", function(req,res){
    Article.deleteOne({title: req.params.articleTitle},function(err){
        if(err){
            res.send(err);
        }
        else{
            res.send("Successfully deleted the article");
        }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});