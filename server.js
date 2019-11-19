const express = require('express');
const bodyParser = require("body-parser");

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/store', {
  useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  path: String,
  orders: { type: Number, default: 0 }
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

// Create a new item in the store: takes a title and a path to an image.
app.post('/api/items', async(req, res) => {
  const item = new Item({
    title: req.body.title,
    description: req.body.description,
    path: req.body.path,
  });
  try {
    await item.save();
    res.send(item);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the store.
app.get('/api/items', async(req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    let item = await Item.deleteOne({_id:req.params.id});
    res.send(item);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Increment orders count
app.put('/api/items/:id', async (req, res) => {
  try {
    let item = await Item.findOne({_id:req.params.id});
    item.orders += 1;
    item.save();
    res.send(item);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(4000, () => console.log('Server listening on port 4000!'));