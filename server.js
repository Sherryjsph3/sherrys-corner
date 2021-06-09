//Denpendencies
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
//Perform CRUD on our model
//require the model in order to perform
const Products = require('./models/products.js');
//Create a variable to store our port value
const PORT = 3000;

//Mounting our Middleware functions
app.use(express.urlencoded({ extended: false}));

const db = mongoose.connection;
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}) 

// Listen for mongodb events -- event listeners
db.on('error', (error) => console.log(error.message + ' is mongodb not running?'));
db.on('connected', () => console.log('monogdb connected'));
db.on('disconnected', () => console.log('mongodb disconnected'));


//Set up our routes and controller code
//SEED 
const productsSeed = require('./models/productsSeed.js');
app.get('/product/seed', (req, res) => {
	Products.deleteMany({}, (error, allProducts) => {});

	Products.create(productsSeed, (error, data) => {
		res.redirect('/product');
	});
});

//INDEX
app.get('/product', (req, res) => {
    Products.find({}, (error, allProducts) => {
        res.render('index.ejs', {
            product: allProducts,
        });
    });
});

//NEW


//DELETE
app.delete('/product/:id', (req, res) => {
    Products.findByIdAndDelete(req.params.id, (error, deletedProduct) => {
		res.send(deletedProduct);
    })
})

//UPDATE
app.put('/product/:id', (req, res) => {
    Products.findByIdAndUpdate(
        req.params.id,
        req.body, //the new data to update it with
        {new: true},
        (error, updatedProduct) => {
            res.send(updatedProduct);
        }
    );
});

//CREATE
app.post('/product', (req, res) => { // .create uses req.body
    Products.create(req.body, function(error, newProduct){
        res.send(newProduct);
    });
});

//EDIT

//SHOW
app.get('/product/:id', (req, res) => {
    Products.findById(req.params.id, (error, foundProduct) => {
        res.send(foundProduct);
    });
});

//Tell Express to Listen
app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));