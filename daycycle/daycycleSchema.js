// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Schema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    configuration:String,
    description: {
        type: String,
        default: "Day-Cycle Configuration"
    },
    maxmoonlight: {
        type: Number,
        default: 50
    }
/*    uniqueID:{
        type: String,
        required: false, //normal war es auf true
        //unique: true
    }
    */
});

// Export the Mongoose model
module.exports = mongoose.model('Daycycle', Schema);


