const Industry = require("../models/industry.model");
const bcrypt = require('bcrypt');

// REGISTER INDUSTRIAL USER
const registerIndustry = async (req, res) => {
    try {
        const { email, password, licence, name, contact, address, district, localbody_type, localbody_name } = req.body;

        if(!name || !email || !password  || !address || !district || !localbody_type || !localbody_name || !licence) {
            return res.status(400).json({ success : false, message : "All fields are required !"}); 
        }

        const existingIndustry = await Industry.findOne({ email });
        if(existingIndustry) {
            return res.status(400).json({ success : false, message : "Industry already exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const industry = await Industry.create({
            email,
            password : hashedPassword,
            licence,
            address,
            district,
            contact,
            industry_name : name,
            localbody_name,
            localbody_type
        });
        await industry.save();

        req.session.user = { user_id : industry._id, email : industry.email };
        res.status(200).json({ success : true, message : "Industry Registered Successfully" });
    } catch (error) {
        res.status(500).json({ success : false, message : "Error Occured", err : error })
    }
}

// INDUSTRIAL USER LOGIN
const loginIndustry = async (req, res) => {
  try {
    const { email, password, location } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required !" });
    }

    const industry = await Industry.findOne({ email });
    if (!industry) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const compare = await bcrypt.compare(password, industry.password);
    if (!compare) {
      return res.status(400).json({ success: false, message: "Password mismatch" });
    }

    if (location) {
      industry.location_coords = location; 
      await industry.save();
    }

    req.session.user = { user_id: industry._id, email: industry.email };
    res.status(200).json({ success: true, message: "Authenticated successfully !" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred", err: error });
  }
};

// CHECK SESSION
const checkAuth = async (req, res) => {
    try {
        if(!req.session.user || !req.session) {
            return res.status(400).json({ success : false, message : "You Are Not Authenticated" });
        }
        res.status(200).json({ success : true });
    } catch (error) {
        res.status(500).json({ success : false, message : 'Error Occured', err : error });
        console.log(error);
    }
}

// CHECK WHETHER ACCEPTED OR NOT
const checkStatus = async (req, res) => {
    try {
        const user = req.user;
        res.status(400).json({ success : true, status : user.status, name : user.industry_name });
    } catch (error) {
        res.status(500).json({ success : false, message : 'Error Occured', err : error });
        console.log(error);
    }
}

// GET PROFILE
const getIndustryProfile = async (req, res) => {
  try {
    const industry = await Industry.findById(req.user._id).select("-password");
    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }
    res.json({ success: true, data: industry });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
};

// UPDATE PROFILE
const updateIndustryProfile = async (req, res) => {
  try {
    const { industry_name, contact, address, district, localbody_type, localbody_name, licence } = req.body;

    const updated = await Industry.findByIdAndUpdate(
      req.user.user_id,
      { industry_name, contact, address, district, localbody_type, localbody_name, licence },
      { new: true, runValidators: true, select: "-password" }
    );

    res.json({ success: true, message: "Profile updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};

// LOGOUT
const logoutIndustry = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.json({ success: true, message: "Logged out successfully" });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error logging out" });
  }
};


module.exports = {
  registerIndustry,
  checkAuth,
  loginIndustry,
  checkStatus, 
  getIndustryProfile, 
  updateIndustryProfile, 
  logoutIndustry
}