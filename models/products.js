//require our dependies -- can refer to multiple times
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Set up our schema
const productsSchema = new Schema({
    //we can define out schema fields here
    name: String,
    description: String,
    img: String,
    price: Number,
    qty: Number
}, {
    timestamps: true
});

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;