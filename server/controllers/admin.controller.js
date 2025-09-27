const Admin = require("../models/admin.model");
const Industry = require("../models/industry.model");
const Pickup = require("../models/pickup.model");
const User = require("../models/user.model");
const EcoAgent = require('../models/ecoagent.model');

// ADMIN LOGIN
const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await Admin.findOne({ email });
        if(!user) {
            return res.status(400).json({ success : false, message : "User not found" });
        }

        if(password !== user.password) {
            return res.status(400).json({ success : false, message : "Password Missmatch" });
        }

        req.session.admin = { admin_id : user._id, email : user.email };
        res.status(200).json({ success : true, message : 'Successfully Logged in' });
    } catch (error) {
        res.status(500).json({ success : false, message : "Error occured !", err : error });
        console.log(error);
    }
}

// GET INDUSTRIES WITH STATUS : PENDING
const getNewIndustry = async (req, res) => {
    try {
        const industries = await Industry.find({ status: "pending" });

        if (!industries || industries.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No unverified industries found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Unverified industries fetched successfully", 
            data: industries 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: "Error occurred while fetching industries", 
            err: error 
        });
    }
};

// VERIFY INDUSTRY
const verifyIndustry = async (req, res) => {
  try {
    const { id } = req.params;
    const industry = await Industry.findByIdAndUpdate(
      id,
      { status: "verified" },
      { new: true }
    );

    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Industry verified successfully", 
      data: industry 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: "Error while verifying industry", 
      err: error 
    });
  }
};

// REJECT INDUSTRY AND DELETE FROM DB
const rejectIndustry = async (req, res) => {
  try {
    const { id } = req.params;

    const industry = await Industry.findByIdAndDelete(id);

    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Industry rejected, removed from DB, email sent successfully (Ethereal)" 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: "Error while rejecting industry", 
      err: error 
    });
  }
};

// GET ALL INDUSTRIES
const getIndustries = async (req, res) => {
  try {
    const industries = await Industry.find();

    if (!industries || industries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No industries found",
      });
    }

    return res.status(200).json({
      success: true,
      message : "Successfully fetched",
      data: industries,
    });
  } catch (error) {
    console.error("Error fetching industries:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching industries",
      err: error.message,
    });
  }
};


// GET ALL PICKUPS WITH USER DETAILS
const getAllPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find()
      .populate("user", "full_name email")
      .sort({ createdAt: -1 });

    if (!pickups || pickups.length === 0) {
      return res.status(404).json({ success: false, message: "No pickups found" });
    }

    return res.status(200).json({
      success: true,
      message: "Pickups fetched successfully",
      data: pickups,
    });
  } catch (error) {
    console.error("Error fetching pickups:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching pickups",
      err: error.message,
    });
  }
};

// DELETE PICKUP BY ADMIN
const deletePickup = async (req, res) => {
  try {
    const { id } = req.params;
    const pickup = await Pickup.findByIdAndDelete(id);

    if (!pickup) {
      return res.status(404).json({ success: false, message: "Pickup not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Pickup deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting pickup:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting pickup",
      err: error.message,
    });
  }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching users",
      err: error.message,
    });
  }
};

// DELETE A USER
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting user",
      err: error.message,
    });
  }
};

// GET SINGLE USER
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching user",
      err: error.message,
    });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating user",
      err: error.message,
    });
  }
};


const createEcoAgent = async (req, res) => {
  try {
    const { fullname, password, district, localbody_type, localbody_name } = req.body;

    if(!fullname || !password || !district || !localbody_type || !localbody_name) {
      return res.status(400).json({ success : false, message : "All Fields are mandatory" });
    }

    const agent = await EcoAgent.create({
      full_name : fullname,
      password,
      district,
      localbody_name,
      localbody_type
    });

    const id = agent._id.toString().slice(-6);
    res.status(200).json({ success : true, message : "Agent Created successfully", data : { id : id } });
  } catch (error) {
    console.error("Error creating agent :", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating agent",
      err: error.message,
    });
  }
}

module.exports = {
    adminLogin,
    getNewIndustry,
    rejectIndustry,
    verifyIndustry,
    getIndustries,
    getAllPickups,
    deletePickup,
    getAllUsers,
    deleteUser,
    getUserById,
    updateUser,
    createEcoAgent
}