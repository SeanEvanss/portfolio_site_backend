const express = require('express');

const helmet = require('helmet');
const crypto = require('crypto');

const UserModel = require('./models/user_models');
const apiKeyModel = require('./models/apiKey_models');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());

app.post('/users', async (req, res) => {
    const user = new UserModel(req.body);
    //Joi input validation
    var err = user.joiValidate(req.body);
    //console.log(err.error);
    if (err.error) {
        //console.log(err.error.details[0].message);
        res.status(400).send(err.error.details[0].message);
    }
    else {
        try {
            //Computes our API key's hash
            var hash = crypto.createHash('sha256').update(req.headers.apikey).digest('base64');
            const apiKeyFound = await apiKeyModel.findOne({ apiKey: hash });
            //If hashed key has been found, we proceed with the POST request
            if (apiKeyFound) {
                await user.save();
                res.status(201).send('Message successfully created');           
            }
            else{
                res.status(401).send({ error: "Invalid API key" });
            }
        }
        catch (e) {
            res.status(500).send(e);
        }
    }
});

app.get('/users', async (req, res) => {        
    try {
        var hash = crypto.createHash('sha256').update(req.headers.apikey).digest('base64');
        //console.log(hash);    
        const apiKeyFound = await apiKeyModel.findOne({ apiKey: hash });
        if (apiKeyFound) {
            const users = await UserModel.find({});
            res.send(users);
        }
        else {
            res.status(401).send("Invalid API key");
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
});

//API endpoint to create a new api key
//This will be removed during production since we should only require one key
app.post('/apiKey', async (req, res) => {

    var hash = crypto.createHash('sha256').update(req.body.apiKey).digest('base64');
    req.body.apiKey = hash;
    console.log(hash);
    const apiKey = new apiKeyModel(req.body);
    try {
        await apiKey.save();
        res.send(apiKey);
    }
    catch (e) {
        res.status(500).send(e);
    }
});

//Export the endpoints created
module.exports = app;