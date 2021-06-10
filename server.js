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
app.use(express.static('public'));

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
app.get('/product/new', (req, res) => {
    res.render('new.ejs')
})

//DELETE
app.delete('/product/:id', (req, res) => {
    Products.findByIdAndDelete(req.params.id, (error, deletedProduct) => {
		res.redirect('/product/');
    })
})

//UPDATE
app.put('/product/:id', (req, res) => {
   
    //step 1 -> find theproduct in mongodb and update in with req.body
    Products.findByIdAndUpdate(req.params.id, req.body, (err, updatedProduct) => {
    //step 2 -> redirect the user somwhere else
    res.redirect(`/product/${req.params.id}`); //redirect to the show page
    } );
    
});

//UPDATE -- FOR THE BUY BUTTON -- we are updating the qty number of items left in stock
// app.put('/product/:id', (req, res) => {
//     //step 1 -> reformat the completed property in req.body
//     if(req.body.qty < 0) {
//         req.body.qty -= 1
//     } else {
//         document.querySelector('button').style.visibility='hidden'       
//     }
//     //step 2 -> find the product in mongodb and update in with req.body
//     Products.findByIdAndUpdate(req.params.id, req.body, {new: true }, (err, updatedProduct) => {
//     res.redirect('/product/'); //redirect to the index page after checkout
//     } );
    
// });


//CREATE
app.post('/product', (req, res) => { // .create uses req.body
    Products.create(req.body, (error, newProduct) => {
        res.redirect('/product');
    });
});

//EDIT
app.get('/product/:id/edit', (req, res) => {
    //step 1 -> we need to find the product we are editing
    //step 2 -> we need to insert the product into a template -> edit.ejs
    Products.findById(req.params.id, (error, foundProduct) => {
        res.render('edit.ejs', {//context object
            product: foundProduct
        })
    })
    })

//SHOW
app.get('/product/:id', (req, res) => {
    Products.findById(req.params.id, (error, foundProduct) => {
        res.render('show.ejs', {
            product: foundProduct
        });
    });
});

//Tell Express to Listen
app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));