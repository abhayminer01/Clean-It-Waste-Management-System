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

// Industry pickup
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
            sheduled_date : pickupDate
        });

        res.status(200).json({ success : true, message : "Pickup Scheduled Succesfully", pickup : pickup});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message : "Error Occured", err : error });
    }
}

// GET ALL PICKUPS FOR LOGGED-IN USER
const getUserPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: pickups });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching pickups", err: error });
  }
};

// DELETE PICKUP
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

// UPDATE PICKUP
const updatePickup = async (req, res) => {
  try {
    const { id } = req.params;
    const { wasteType, pickupDate, timeSlot } = req.body;

    const pickup = await Pickup.findOneAndUpdate(
      { _id: id, user: req.user._id },
      {
        waste_type: wasteType,
        sheduled_date: pickupDate,
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

// ✅ Get all pickups for logged-in user
const getIndustryUserPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({ user: req.user._id }).sort({ sheduled_date: -1 });
    res.status(200).json({ success: true, pickups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching pickups", err: error });
  }
};

// ✅ Update pickup
const updateIndustryPickup = async (req, res) => {
  try {
    const { id } = req.params;
    const { waste_type, sheduled_date, scheduled_time } = req.body;

    const pickup = await Pickup.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { waste_type, sheduled_date, scheduled_time },
      { new: true }
    );

    if (!pickup) return res.status(404).json({ success: false, message: "Pickup not found" });

    res.status(200).json({ success: true, message: "Pickup updated", pickup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update pickup", err: error });
  }
};

// ✅ Delete pickup
const deleteIndustryPickup = async (req, res) => {
  try {
    const { id } = req.params;
    const pickup = await Pickup.findOneAndDelete({ _id: id, user: req.user._id });

    if (!pickup) return res.status(404).json({ success: false, message: "Pickup not found" });

    res.status(200).json({ success: true, message: "Pickup deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete pickup", err: error });
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
    deleteIndustryPickup
}