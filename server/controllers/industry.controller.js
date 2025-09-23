const Industry = require("../models/industry.model");

const registerIndustry = async (req, res) => {
    try {
        const { email, password, licence, name, address, district, localbody_type, localbody_name } = req.body;

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

module.exports = {
    registerIndustry
}