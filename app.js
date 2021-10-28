require('dotenv').config();
const PORT = 8000;

const Express = require('express');
const Mongoose = require('mongoose');
const mongodb= require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const uri= process.env.MONGODB_URI;
const databaseName = "Messages";

var app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.listen(PORT, () => {    
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {            
            console.log(err);
            throw err;            
        }
    
        database= client.db(databaseName);
        collection= database.collection('personnel');

        console.log('Connected to '+ databaseName +' database on port '+PORT);               
    });
});
app.get('/', (req, res) => {    
    res.send('Hello World!');
}); 

app.post('/personnel', (req, res) => {
    collection.insertOne(req.body, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        res.sendStatus(201);
    });
});

app.get('/personnel', (req, res) => {
    collection.find({}).toArray((err, results) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        res.send(results);
    })
});   

app.delete('/personnel', (req, res) => {
    collection.deleteOne({"_id": new mongodb.ObjectId(req.body._id)}, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        res.send(result);
    });
});