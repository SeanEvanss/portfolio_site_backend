require('dotenv').config();
const PORT = 8000;

const Express = require('express');
//we might want to delete and prune body-parser
const BodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

//const uri= "mongodb+srv://main:7AxGVDxE3DJ3n5@react-portfolio-cluster.a42hy.mongodb.net/Messages?retryWrites=true&w=majority";
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

        console.log('Connected to '+ databaseName +' database');                
    });
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