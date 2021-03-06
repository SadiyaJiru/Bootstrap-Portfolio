// Add code to userModel.js to complete the model
var request = require('request');

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var PORT = 8080;

// Requiring the `User` model for accessing the `users` collection
var User = require("./contactsDB");

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder

app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/portfolio_inbox", { useNewUrlParser: true });

// var databaseUri = "mongodb://localhost/portfolio_inbox";

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/portfolio_inbox";

mongoose.connect(MONGODB_URI);

//Connecting to Heroku
if(process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI);
}else{
  mongoose.connect(MONGODB_URI);
}
var db = mongoose.connection;
db.on("error", function(err){
  console.log("Mongoose Error: ", err)
});
db.once("open", function(){
  console.log("Mongoose Connection Successful.");
});

  // Load index page 
  app.get('/', (req, res) => {
    res.render('index', {
     
    });
  });

// Route to post our form submission to mongoDB via mongoose
app.post("/submit", function(req, res) {
  // Create a new user using req.body
var user = new User(req.body);

user.setFullName();
user.lastUpdatedDate();
  // Update this route to run the `setFullName` and `lastUpdatedDate` methods before creating a new User
  // You must create these methods in the model.
  User.create(user)
    .then(function() {
      // If saved successfully, send the the new User document to the client
      res.redirect("/");
          })
    .catch(function(err) {
      // If an error occurs, send the error to the client
      res.json(err);
    });

});


// Start the server
app.listen(process.env.PORT || 8080, function() {
  console.log("App running on port " + PORT + "!");
});