const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    waste_type : {
        type : String,
        enum : ["Plastic", "Organic", "E-Waste", "Scrap", "Other"]
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
    },
    pickup_type : {
        type : String,
        enum : ['household', 'industrial'],
        default : 'household'
    }
}, { timestamps : true });

const Pickup = mongoose.model('Pickup', pickupSchema);
module.exports = Pickup;