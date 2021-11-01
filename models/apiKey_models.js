const Mongoose = require('mongoose');

//We defined the schema of the apiKey model
const apiKeySchema = new Mongoose.Schema({
    apiKey: {
        type: String,
        required: true,
    },
});

apiKeySchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) {
            return callback(err);
        }
        else{
            callback(null, isMatch);
        }
    });
};


//Exports the schema
const apiKey = Mongoose.model('apiKey', apiKeySchema);
module.exports = apiKey;