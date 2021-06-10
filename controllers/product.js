const express = require('express');
const Products = require('../models/products.js');
const productRouter = express.Router();//an object that provides "router functionality" ROuter() factory function pattern 

//ROUTES

//SEED 
const productsSeed = require('../models/productsSeed.js');

productRouter.get('/seed', (req, res) => {
	Products.deleteMany({}, (error, allProducts) => {});

	Products.create(productsSeed, (error, data) => {
		res.redirect('/product');
	});
});

//INDEX
productRouter.get('/', (req, res) => {
    Products.find({}, (error, allProducts) => {
        res.render('index.ejs', {
            product: allProducts,
        });
    });
});

//NEW
productRouter.get('/new', (req, res) => {
    res.render('new.ejs')
})

//DELETE
productRouter.delete('/:id', (req, res) => {
    Products.findByIdAndDelete(req.params.id, (error, deletedProduct) => {
		res.redirect('/product/');
    })
})

//UPDATE
productRouter.put('/:id', (req, res) => {
   
    //step 1 -> find theproduct in mongodb and update in with req.body
    Products.findByIdAndUpdate(req.params.id, req.body, {new: true }, (err, updatedProduct) => {
    //step 2 -> redirect the user somwhere else
    res.redirect(`/product/${req.params.id}`); //redirect to the show page
    } );
    
});


//CREATE
productRouter.post('/', (req, res) => { // .create uses req.body
    Products.create(req.body, (error, newProduct) => {
        res.redirect('/product');
    });
});

//EDIT
productRouter.get('/:id/edit', (req, res) => {
    //step 1 -> we need to find the product we are editing
    //step 2 -> we need to insert the product into a template -> edit.ejs
    Products.findById(req.params.id, (error, foundProduct) => {
        res.render('edit.ejs', {//context object
            product: foundProduct
        })
    })
    })

//SHOW
productRouter.get('/:id', (req, res) => {
    Products.findById(req.params.id, (error, foundProduct) => {
        res.render('show.ejs', {
            product: foundProduct
        });
    });
});

module.exports = productRouter; //transfering all our router code here