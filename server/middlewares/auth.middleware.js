const EcoAgent = require("../models/ecoagent.model");
const Industry = require("../models/industry.model");
const User = require("../models/user.model");

const userAuthMiddleware = async (req, res, next) => {
    try {
        if(!req.session.user || !req.session) {
            return res.status(400).json({ success : false, message : "Authentication Required" });
        }

        const user = await User.findById(req.session.user.user_id);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message : "Error occured on auth middleware", err : error });
    }
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
        console.log(error);
        res.status(500).json({ success : false, message : "Error occured on auth middleware", err : error });
    }
}


const ecoagentAuthMiddleware = async (req, res, next) => {
    try {
        if(!req.session.agent) {
            return res.status(400).json({ success : false, message : "You need to be logged in" });
        }

        const user = await EcoAgent.findById(req.session.agent.agent_id);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message : "Error occured on auth middleware", err : error });
    }
}
module.exports = {
    userAuthMiddleware,
    industryAuthMiddleware,
    ecoagentAuthMiddleware
}