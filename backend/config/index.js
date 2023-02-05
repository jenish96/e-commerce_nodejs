const mongodb = require("mongoose");

mongodb.connect('mongodb://localhost:27017/e-dash',()=>{
    console.log('DB Connected!');
})