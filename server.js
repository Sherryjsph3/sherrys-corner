//Denpendencies
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const methodOverride = require('method-override');
//Perform CRUD on our model

//Create a variable to store our port value
const PORT = 3000;

//Mounting our Middleware functions
app.use(express.urlencoded({ extended: false}));
app.use(methodOverride('_method'));
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
const productController = require('./controllers/product.js')

app.use('/product', productController)

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
//Tell Express to Listen
app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));