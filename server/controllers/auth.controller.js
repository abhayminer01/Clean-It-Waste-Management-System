const User = require("../models/user.model");
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {

}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ success : false, message : "User not found !" });
        }

        const compare = await bcrypt.compare(password, user.password);
        if(!compare) {
            return res.status(400).json({ success : false, message : "Invalid Password !" });
        }

        req.session.user = { user_id : user._id, email : user.email };
        res.status(200).json({ success : true, message : "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ success : false, message : "Error Occured : "+error });
        console.log(error);
    }
}

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