const Pickup = require("../models/pickup.model");

const createPickup = async (req, res) => {
    try {
        const { wasteType, pickupDate, timeSlot } = req.body;
        if(!wasteType || !pickupDate || !timeSlot){
            return res.status(400).json({ success : false, message : "All fields are required" });
        }

        const pickup = Pickup.create({
            user : req.user._id,
            waste_type : wasteType,
            scheduled_time : timeSlot,
            sheduled_date : pickupDate
        });

        res.status(200).json({ success : true, message : "Pickup Scheduled Succesfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message : "Error Occured", err : error });
    }
}


module.exports = {
    createPickup
}