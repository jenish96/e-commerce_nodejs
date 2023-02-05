const mongodb = require('mongoose');

const Schema = mongodb.Schema({
    name:String,
    email:String,
    password:String
})

module.exports = mongodb.model('users',Schema);