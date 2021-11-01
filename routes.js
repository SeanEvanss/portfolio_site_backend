const express = require('express');

const helmet = require('helmet');
const crypto = require('crypto');

const UserModel = require('./models/user_models');
const apiKeyModel = require('./models/apiKey_models');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.post('/users', async (req, res) => {
    const user = new UserModel(req.body);
    var err = user.joiValidate(req.body);
    
    if (err) {
        console.log(err["error"]);
        res.status(400).send(err);
    }
    else {
        try {
            await user.save();
            res.send(user);
        }
        catch (e) {
            res.status(500).send(e);
        }
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

app.get('/users', async (req, res) => {

    var hash = crypto.createHash('sha256').update(req.body.apiKey).digest('base64');
    console.log(hash);
    try {
        const apiKeyData = await apiKeyModel.findOne({ apiKey: hash });
        if (apiKeyData) {
            const users = await UserModel.find({});
            res.send(users);
        }
        else {
            res.status(401).send("Unauthorized");
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
});

//Export the endpoints created
module.exports = app;