require('./config');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const User = require('./model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const Product = require('./model/Product');
const { ObjectId } = require('mongodb');
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "./e-com_react/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./e-com_react/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

console.log(path.join(__dirname, "./e-com_react/build"))

app.post('/login', async (req, res) => {
    const payload = req.body

    if (payload.email && payload.password) {
        const user = await User.findOne({ email: payload.email });
        if (bcrypt.compareSync(payload.password, user.password)) {
            let token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '5h' });
            res.send({ data: user, token: token });
        } else {
            res.send('User not exists!');
        }
    } else {
        res.send('Please Enter email and password');
    }
})

app.post('/register', async (req, res) => {
    const payload = req.body;
    payload['password'] = bcrypt.hashSync(payload.password, 10);
    const data = new User(payload);
    let user = await data.save();
    let token = jwt.sign(user.toJSON(), process.env.JWT_KEY, { expiresIn: '5h' });
    res.send({ data: user, token: token });
})

app.get('/getProduct', async (req, res) => {
    const result = await Product.find();
    res.send(result);
})

app.get('/product/:id', async (req, res) => {
    const result = await Product.findById({ _id: ObjectId(req.params.id) });
    res.send(result);
})

app.post('/addProduct', async (req, res) => {
    const product = new Product(req.body);
    const result = await product.save();
    res.send(result);
})

app.patch('/updateProduct/:id', async (req, res) => {
    const result = await Product.updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body })
    res.send(result)
})

app.delete('/delete/:id', async (req, res) => {
    const result = await Product.deleteOne({ _id: req.params.id });
    res.send(result);
})

app.get('/search/:key', async (req, res) => {
    const result = await Product.find({
        '$or': [
            { 'name': { $regex: req.params.key } },
            { 'company': { $regex: req.params.key } }
        ]
    });
    res.send(result);
})

app.listen('5000', () => {
    console.log(`http://localhost:${process.env.PORT}`, 'runing port')
})