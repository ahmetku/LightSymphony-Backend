// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Schema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    configuration:
    {
        type:String,
        required: true
    },
    description: {
        type: String,
        default: "Day-Cycle Configuration"
    },
    maxmoonlight: {
        type: Number,
        default: 50
    },
    uniqueID:{
        type: String,
        required: true, //normal war es auf true
        unique: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:false
    }

});

// Export the Mongoose model
module.exports = mongoose.model('Daycycle', Schema);


