const Admin = require("../models/admin.model");
const Industry = require("../models/industry.model");
const nodemailer = require('nodemailer');

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

// REJECT INDUSTRY AND DELETE FROM DB (Ethereal Email for testing)
const rejectIndustry = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the industry
    const industry = await Industry.findByIdAndDelete(id);

    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }

    // Create a test account on Ethereal
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
      from: `"Admin Panel" <${testAccount.user}>`,
      to: industry.email, // recipient email
      subject: "Industry Registration Rejected",
      text: `Hello ${industry.industry_name},\n\nWe regret to inform you that your industry registration has been rejected.\n\nRegards,\nAdmin Team`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Preview URL: %s", nodemailer.getTestMessageUrl(info));

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

module.exports = {
    adminLogin,
    getNewIndustry,
    rejectIndustry,
    verifyIndustry,
    getIndustries
}