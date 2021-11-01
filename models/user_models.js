const Mongoose = require('mongoose');

//We defined the schema of the user
const userSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
});

//Exports the schema
const User = Mongoose.model('User', userSchema);
module.exports = User;