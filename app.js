require('dotenv').config();
const PORT = 8000;

const Mongoose = require('mongoose');
const express = require('express');
const Routes = require('./routes');
const helmet = require('helmet');
const uri = process.env.MONGODB_URI;


const app= express();
app.use(express.json());
app.use(helmet());


Mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

app.use(Routes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
