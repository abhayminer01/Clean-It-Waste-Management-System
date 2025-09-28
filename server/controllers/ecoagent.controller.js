
const bcrypt = require("bcrypt");
const EcoAgent = require("../models/ecoagent.model");
const User = require("../models/user.model");
const Pickup = require("../models/pickup.model");
const Industry = require("../models/industry.model");
const Payment = require("../models/payment.model")

// ECO AGENT LOGIN
const agentLogin = async (req, res) => {
  try {
    const { id, password, lat, lng } = req.body;

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

    // Update location if provided
    if (typeof lat === "number" && typeof lng === "number") {
      agent.location_coords = { lat, lng };
      await agent.save();
    }

    req.session.agent = { agent_id: agent._id };

    return res.json({
      success: true,
      message: "Login successful",
      agent: {
        id: agent._id,
        full_name: agent.full_name,
        district: agent.district,
        localbody_type: agent.localbody_type,
        localbody_name: agent.localbody_name,
        location_coords: agent.location_coords,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET NEW PICKUPS FOR ECO AGENT
// Household pickups
const getNewHouseholdPickups = async (req, res) => {
  try {
    const user = req.user;
    if (!user?.user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const agent = await EcoAgent.findById(user.user_id);
    if (!agent) return res.status(404).json({ success: false, message: "Agent not found" });

    // Get all household users in same area
    const usersInSameArea = await User.find({
      district: agent.district,
      localbody_type: agent.localbody_type,
      localbody_name: agent.localbody_name,
    }).select("_id");

    const userIds = usersInSameArea.map((u) => u._id);

    if (!userIds.length) return res.status(200).json({ success: true, pickups: [] });

    const pickups = await Pickup.find({
      user: { $in: userIds },
      status: "pending",
      pickup_type: "household"
    })
      .populate({
        path: "user",
        select: "full_name email mobile_number address district localbody_type localbody_name location_coords",
        model: User,
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, pickups });
  } catch (error) {
    console.error("Error in getNewHouseholdPickups:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Industrial pickups
const getNewIndustrialPickups = async (req, res) => {
  try {
    const user = req.user;
    if (!user?.user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const agent = await EcoAgent.findById(user.user_id);
    if (!agent) return res.status(404).json({ success: false, message: "Agent not found" });

    const industrialUsersInSameArea = await Industry.find({
      district: agent.district,
      localbody_type: agent.localbody_type,
      localbody_name: agent.localbody_name,
    }).select("_id");

    const industrialUserIds = industrialUsersInSameArea.map((ind) => ind._id);

    if (!industrialUserIds.length) return res.status(200).json({ success: true, pickups: [] });

    let pickups = await Pickup.find({
      user: { $in: industrialUserIds },
      status: "pending",
      pickup_type: "industrial"
    })
      .populate("payment")
      .sort({ createdAt: -1 });

    // Attach industrial user info via Payment
    const processed = [];
    for (const pickup of pickups) {
      try {
        if (!pickup.payment) continue;

        const payment = await Payment.findById(pickup.payment).populate({
          path: "user",
          select: "name email licence address district localbody_type localbody_name location_coords",
          model: Industry,
        });

        if (payment && payment.user) {
          const industrialPickup = pickup.toObject();
          industrialPickup.user = payment.user;
          industrialPickup.payment = {
            _id: payment._id,
            amount: payment.amount,
            status: payment.status,
            createdAt: payment.createdAt,
          };
          processed.push(industrialPickup);
        }
      } catch (err) {
        console.error("Error populating industrial pickup:", err);
      }
    }

    return res.status(200).json({ success: true, pickups: processed });
  } catch (error) {
    console.error("Error in getNewIndustrialPickups:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
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
    console.log("ping")
    if (!req.session?.agent || !req.session.agent.agent_id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No agent logged in" });
    }

    const agentId = req.session.agent.agent_id;

    // Fetch accepted household pickups
    const householdPickups = await Pickup.find({
      agent: agentId,
      status: "accepted",
      pickup_type: "household",
    });

    const householdUserIds = householdPickups.map(p => p.user);

    // Fetch household user details
    const householdUsers = await User.find({
      _id: { $in: householdUserIds }
    }).select("_id full_name email location_coords address mobile_number");

    const householdPickupsWithUser = householdPickups.map(p => {
      const user = householdUsers.find(u => u._id.equals(p.user));
      return { ...p.toObject(), user };
    });

    // Fetch accepted industrial pickups
    const industrialPickups = await Pickup.find({
      agent: agentId,
      status: "accepted",
      pickup_type: "industrial",
    });

    const industrialUserIds = industrialPickups.map(p => p.user);

    // Fetch industrial user details
    const industrialUsers = await Industry.find({
      _id: { $in: industrialUserIds }
    }).select("_id industry_name address phone district localbody_name localbody_type");

    const industrialPickupsWithUser = industrialPickups.map(p => {
      const user = industrialUsers.find(u => u._id.equals(p.user));
      return { ...p.toObject(), user };
    });

    res.status(200).json({
      success: true,
      message: "Accepted pickups fetched successfully",
      data: {
        household: householdPickupsWithUser,
        industrial: industrialPickupsWithUser,
      },
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

module.exports = { agentLogin, acceptPickup, getAcceptedPickups, markPickupAsPicked, getNewHouseholdPickups, getNewIndustrialPickups };
