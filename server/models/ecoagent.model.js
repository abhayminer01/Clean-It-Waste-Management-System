const mongoose = require('mongoose');

const ecoAgentSchema = new mongoose.Schema({
    full_name : {
        type : String
    },
    password : {
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

const EcoAgent = mongoose.model('EcoAgent', ecoAgentSchema);
module.exports = EcoAgent;