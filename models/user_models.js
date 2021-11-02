const Mongoose = require('mongoose');
const Joi= require('joi');
//We defined the schema of the user
var userSchema = new Mongoose.Schema({
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
userSchema.methods.joiValidate= function(body){    
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        message: Joi.string().min(3).max(281).required(),
    });    
    return schema.validate(body);
}
//Exports the schema
const User = Mongoose.model('User', userSchema);
module.exports = User;