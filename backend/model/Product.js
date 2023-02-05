const mongodb = require('mongoose');

const Schema = mongodb.Schema({
    name:String,
    company:String,
    price:Number
});

module.exports = mongodb.model('products',Schema)