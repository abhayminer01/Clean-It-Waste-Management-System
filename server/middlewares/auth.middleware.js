const Industry = require("../models/industry.model");

const userAuthMiddleware = async (req, res, next) => {

}


const industryAuthMiddleware = async (req, res, next) => {
    try {
        if(!req.session.user) {
            return res.status(400).json({ success : false, message : "You need to be logged in" });
        }

        const user = await Industry.findById(req.session.user.user_id);
        req.user = user;
        next();
    } catch (error) {
        
    }
}

module.exports = {
    userAuthMiddleware,
    industryAuthMiddleware
}