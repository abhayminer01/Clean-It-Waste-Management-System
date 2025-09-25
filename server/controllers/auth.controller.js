const User = require("../models/user.model");
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    try {
        const { full_name, email, password, adhaar, mobile_number, address, district, localbody_type, localbody_name } = req.body;
    
        if(!full_name || !email || !password || !adhaar || !mobile_number || !address || !district || !localbody_type || !localbody_name) {
            return res.status(400).json({ success : false, message : "All fields are required !" });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(401).json({ success : false, message : "User Already Exists !" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            full_name,
            email,
            password : hashedPassword,
            mobile_number,
            uuid : adhaar,
            address,
            district,
            localbody_type,
            localbody_name
        });
        await user.save();

        req.session.user = { user_id : user._id, email : user.email };
        res.status(200).json({ success : true, message : "User Registered Successfully" });
    } catch (error) {
        res.status(500).json({ success : false, message : "Error Occured", err : error })
    }
}

const userLogin = async (req, res) => {
  try {
    const { email, password, location } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found !" });
    }

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.status(400).json({ success: false, message: "Invalid Password !" });
    }

    if (location && location.lat && location.lng) {
      user.location_coords = location;
      await user.save();
    }

    req.session.user = { user_id: user._id, email: user.email };
    res.status(200).json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred: " + error });
    console.log(error);
  }
};


const checkAuth = async (req, res) => {
    try {
        if(!req.session.user) {
            return res.status(400).json({ success : false, message : "You Are Not Authenticated" });
        }
        res.status(200).json({ success : true });
    } catch (error) {
        res.status(500).json({ success : false, message : 'Error Occured', err : error });
        console.log(error);
    }
}

module.exports = {
    registerUser,
    checkAuth,
    userLogin
}