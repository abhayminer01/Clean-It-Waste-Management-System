const Pickup = require("../models/pickup.model");

// HOUSEHOLD USER PICKUP
const createPickup = async (req, res) => {
    try {
        const { wasteType, pickupDate, timeSlot } = req.body;
        if(!wasteType || !pickupDate || !timeSlot){
            return res.status(400).json({ success : false, message : "All fields are required" });
        }

        const pickup = await Pickup.create({
            user : req.user._id,
            waste_type : wasteType,
            scheduled_time : timeSlot,
            scheduled_date : pickupDate
        });

        res.status(200).json({ success : true, message : "Pickup Scheduled Succesfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message : "Error Occured", err : error });
    }
}

// GET ALL PICKUPS FOR LOGGED-IN HOUSEHOLD USERS
const getUserPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: pickups });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching pickups", err: error });
  }
};

// DELETE PICKUP (HOUSEHOLD USER)
const deletePickup = async (req, res) => {
  try {
    const { id } = req.params;
    const pickup = await Pickup.findOneAndDelete({ _id: id, user: req.user._id });

    if (!pickup) {
      return res.status(404).json({ success: false, message: "Pickup not found" });
    }

    res.status(200).json({ success: true, message: "Pickup deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error deleting pickup", err: error });
  }
};

// UPDATE PICKUP (HOUSEHOLD USER)
const updatePickup = async (req, res) => {
  try {
    const { id } = req.params;
    const { wasteType, pickupDate, timeSlot } = req.body;

    const pickup = await Pickup.findOneAndUpdate(
      { _id: id, user: req.user._id },
      {
        waste_type: wasteType,
        scheduled_date: pickupDate,
        scheduled_time: timeSlot,
      },
      { new: true }
    );

    if (!pickup) {
      return res.status(404).json({ success: false, message: "Pickup not found" });
    }

    res.status(200).json({ success: true, message: "Pickup updated successfully", data: pickup });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating pickup", err: error });
  }
};

// INDUSTRIAL USER PICKUP
const createIndustryPickup = async (req, res) => {
    try {
        const { wasteType, pickupDate, timeSlot } = req.body;
        if(!wasteType || !pickupDate || !timeSlot){
            return res.status(400).json({ success : false, message : "All fields are required" });
        }

        const pickup = await Pickup.create({
            user : req.user._id,
            waste_type : wasteType,
            scheduled_time : timeSlot,
            scheduled_date : pickupDate,
            pickup_type : 'industrial'
        });

        res.status(200).json({ success : true, message : "Pickup Scheduled Succesfully", pickup : pickup});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message : "Error Occured", err : error });
    }
}

// GET ALL PICKUP FOR LOGGED IN INDUSTRIAL USERS
const getIndustryUserPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({ user: req.user._id }).populate('payment').sort({ sheduled_date: -1 });
    res.status(200).json({ success: true, pickups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching pickups", err: error });
  }
};

// UPDATE PICKUP (INDUSTRIAL USER)
const updateIndustryPickup = async (req, res) => {
  console.log("ping");
  try {
    const { id } = req.params;
    const { waste_type, sheduled_date, scheduled_time } = req.body;

    const pickup = await Pickup.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { waste_type, scheduled_date, scheduled_time },
      { new: true }
    );

    if (!pickup) return res.status(404).json({ success: false, message: "Pickup not found" });

    res.status(200).json({ success: true, message: "Pickup updated", pickup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update pickup", err: error });
  }
};

// DELETE PICKUP (INDUSTRIAL USER)
const deleteIndustryPickup = async (req, res) => {
  try {
    const { id } = req.params;
    const pickup = await Pickup.findByIdAndDelete(id);

    if (!pickup) return res.status(404).json({ success: false, message: "Pickup not found" });

    res.status(200).json({ success: true, message: "Pickup deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete pickup", err: error });
  }
};

// GET SINGLE PICKUP BY ID (for logged-in user)
const getPickupById = async (req, res) => {
  try {
    const { id } = req.params;
    const pickup = await Pickup.findOne({ _id: id }).populate('payment').populate('user');

    if (!pickup) {
      return res.status(404).json({ success: false, message: "Pickup not found" });
    }

    res.status(200).json({ success: true, data: pickup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching pickup", err: error });
  }
};


module.exports = {
    createPickup,
    createIndustryPickup,
    getUserPickups,
    deletePickup,
    updatePickup,
    getIndustryUserPickups,
    updateIndustryPickup,
    deleteIndustryPickup,
    getPickupById
}