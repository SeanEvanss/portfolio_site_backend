const express = require('express');
const UserModel = require('./models');
const helmet = require('helmet');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.post('/users', async (req, res) => {
    const user = new UserModel(req.body);

    try {
        await user.save();
        res.send(user);
    }
    catch (e) {
        res.status(500).send(e);
    }

});

app.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.send(users);
    }
    catch (e) {
        res.status(500).send(e);
    }
});

//Export the endpoints created
module.exports = app;