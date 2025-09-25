const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    full_name : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    uuid : {
        type : String
    },
    mobile_number : {
        type : String
    },
    address : {
        type : String
    },
    district : {
        type : String
    },
    localbody_type : {
        type : String
    },
    localbody_name : {
        type : String
    },
    location_coords : {
        lat : Number,
        lng : Number
    }
}, { timestamps : true });

const User = mongoose.model('User', userSchema);
module.exports = User;