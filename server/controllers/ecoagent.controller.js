
const bcrypt = require("bcrypt");
const EcoAgent = require("../models/ecoagent.model");


// ECO AGENT LOGIN
const agentLogin = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const agents = await EcoAgent.find({});
    const agent = agents.find(a => a._id.toString().slice(-6) === id);

    if (!agent) {
      return res.status(404).json({ success: false, message: "Agent not found!" });
    }

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials!" });
    }

    req.session.agent = { agent_id : agent._id };

    return res.json({
      success: true,
      message: "Login successful",
      agent: {
        id: agent._id,
        full_name: agent.full_name,
        district: agent.district,
        localbody_type: agent.localbody_type,
        localbody_name: agent.localbody_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { agentLogin };
