
const bcrypt = require("bcrypt");
const EcoAgent = require("../models/ecoagent.model");
const User = require("../models/user.model");
const Pickup = require("../models/pickup.model");


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

// GET NEW PICKUPS FOR ECO AGENT
const getNewPickupsForAgent = async (req, res) => {
  try {
    const agent = req.user;
    if (!agent) return res.status(401).json({ success: false, message: "Unauthorized" });

    const users = await User.find({
      district: agent.district,
      localbody_name: agent.localbody_name,
      localbody_type: agent.localbody_type,
    }).select("_id");

    const userIds = users.map((u) => u._id);

    const pickups = await Pickup.find({
      user: { $in: userIds },
      status: "pending",
    })
      .populate("user", "full_name address mobile_number")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, pickups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch pickups", error });
  }
};

// PATCH /pickup/:id/accept
const acceptPickup = async (req, res) => {
  try {
    const { id } = req.params;

    // get logged in eco agent from session
    if (!req.session?.agent || !req.session.agent.agent_id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No agent logged in" });
    }

    const agentId = req.session.agent.agent_id;

    const pickup = await Pickup.findById(id);
    if (!pickup)
      return res
        .status(404)
        .json({ success: false, message: "Pickup not found" });

    // Only pending pickups can be accepted
    if (pickup.status !== "pending")
      return res.status(400).json({
        success: false,
        message: "Pickup is already accepted or picked",
      });

    pickup.status = "accepted";
    pickup.agent = agentId; // assign agent ID
    await pickup.save();

    res.status(200).json({
      success: true,
      message: "Pickup accepted successfully",
      pickup,
    });
  } catch (error) {
    console.error("Error in acceptPickup:", error);
    res.status(500).json({
      success: false,
      message: "Failed to accept pickup",
      error: error.message,
    });
  }
};

// GET /ecoagent/pickups/accepted
const getAcceptedPickups = async (req, res) => {
  try {
    if (!req.session?.agent || !req.session.agent.agent_id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No agent logged in" });
    }

    const agentId = req.session.agent.agent_id;

    const pickups = await Pickup.find({ agent: agentId, status: "accepted" })
      .populate("user", "full_name email") // include user info
      .populate("payment", "status amount"); // include payment if exists

    res.status(200).json({
      success: true,
      message: "Accepted pickups fetched successfully",
      data: pickups,
    });
  } catch (error) {
    console.error("Error fetching accepted pickups:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch accepted pickups",
      error: error.message,
    });
  }
};

// PATCH /ecoagent/pickups/:id/picked
const markPickupAsPicked = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.session?.agent?.agent_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const pickup = await Pickup.findById(id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: "Pickup not found" });
    }

    if (pickup.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted pickups can be marked as picked",
      });
    }

    // verify agent owns this pickup
    if (pickup.agent.toString() !== req.session.agent.agent_id) {
      return res.status(403).json({ success: false, message: "Not your pickup" });
    }

    pickup.status = "picked";
    await pickup.save();

    res.status(200).json({
      success: true,
      message: "Pickup marked as picked",
      data: pickup,
    });
  } catch (error) {
    console.error("Error marking pickup as picked:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update pickup status",
      error: error.message,
    });
  }
};


module.exports = { agentLogin, getNewPickupsForAgent, acceptPickup, getAcceptedPickups, markPickupAsPicked };
