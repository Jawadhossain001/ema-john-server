const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.penom.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 4000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
//   console.log('database connected');

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        // console.log(products);
        productsCollection.insertMany(products)
        .then(result => {
            // console.log(result);
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })

});


// console.log(process.env.DB_User)

// app.get('/', (req, res) => {
//   res.send('Hello ema john!')
// })

app.listen(process.env.PORT || port)