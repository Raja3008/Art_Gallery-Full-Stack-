var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/ArtGallery");
var db = mongoose.connection;
db.on("error", () =>
  console.log("There is an error in connecting to the database")
);
db.once("open", () => console.log("Connected to Database"));

app.post("/upload", (req, res) => {
  var name = req.body.name;
  var price = req.body.price;
  var details = req.body.details;
  var image=req.body.image;

  var data = {
    name: name,
    price: price,
    details: details,
    image:image,
  };

  db.collection("upload").insertOne(data, (err, collection) => {
    if (err) {
      throw err;
    }
    console.log("Data Inserted Successfully");
    return res.redirect("fs.html");
  });
});

app.get("/", (req, res) => {
  res.set({
    "Allow-acces-Allow-Origin": "*",
  });
  return res.redirect("fs.html");
});

const server = app.listen(4000, () => {
  console.log("Listening on port 4000");
  console.log(`Server is running at http://localhost:4000`);
});
