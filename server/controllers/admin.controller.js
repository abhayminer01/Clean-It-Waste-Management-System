const Admin = require("../models/admin.model");

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
        
    }
}

module.exports = {
    adminLogin
}