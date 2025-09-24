const Admin = require("../models/admin.model");
const Industry = require("../models/industry.model");

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

// Verify an industry
const verifyIndustry = async (req, res) => {
  try {
    const { id } = req.params; // industry id
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

// Reject an industry (delete from DB)
const rejectIndustry = async (req, res) => {
  try {
    const { id } = req.params;
    const industry = await Industry.findByIdAndDelete(id);

    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Industry rejected and removed successfully" 
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

module.exports = {
    adminLogin,
    getNewIndustry,
    rejectIndustry,
    verifyIndustry
}