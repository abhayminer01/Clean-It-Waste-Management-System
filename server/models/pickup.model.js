const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    waste_type : {
        type : String,
        enum : ["Plastic", "Organic", "E-Waste", "Metal", "Other"]
    },
    sheduled_date : {
        type : String
    },
    scheduled_time : {
        type : String
    },
    status : {
        type : String,
        enum : ["pending", "accepted", "picked"],
        default : "pending"
    }
}, { timestamps : true });

const Pickup = mongoose.model('Pickup', pickupSchema);
module.exports = Pickup;