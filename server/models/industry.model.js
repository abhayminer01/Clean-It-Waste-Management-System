const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
    email : {
        type : String
    },
    password : {
        type : String
    },
    licence : {
        type : String
    },
    industry_name : {
        type : String
    },
    status : {
        type : String,
        enum : ['verified', 'pending', 'rejected'],
        default : 'pending'
    },
    address : {
        type : String
    },
    localbody_type : {
        type : String
    },
    localbody_name : {
        type : String
    },
    district : {
        type : String
    },
    location_coords : {
        type : String
    }
}, { timestamps : true });

const Industry = mongoose.model('Industry', industrySchema);
module.exports = Industry;