const mongoose = require('mongoose');
const Participant = require('../models/participantmodel');

exports.settleUp = async (req, res) => {
  try {
    console.log("✅ Received settlement request:");
    console.log("➡️ Request body:", req.body);
    console.log("➡️ Request params:", req.params);

    const { sessionId } = req.params; // Extract from URL
    const { payerId, receiverId, amount } = req.body; // Extract from request body

    if (!sessionId || !payerId || !receiverId || !amount) {
      console.error("❌ Missing required fields.");
      return res.status(400).json({ error: "Session ID, payerId, receiverId, and amount are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId) || !mongoose.Types.ObjectId.isValid(payerId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      console.error("❌ Invalid session ID, payer ID, or receiver ID format.");
      return res.status(400).json({ error: "Invalid session ID, payerId, or receiverId format" });
    }

    console.log("✅ Fetching participants...");
    const payer = await Participant.findById(payerId);
    const receiver = await Participant.findById(receiverId);

    if (!payer || !receiver || payer.sessionId.toString() !== sessionId || receiver.sessionId.toString() !== sessionId) {
      return res.status(400).json({ error: "Invalid payer or receiver ID or they do not belong to this session." });
    }

    // Update balances
    payer.balance -= amount;
    receiver.balance += amount;

    await payer.save();
    await receiver.save();

    console.log("✅ Settlement successful.");
    res.status(200).json({ message: "Settlement successful", balances: { [payerId]: payer.balance, [receiverId]: receiver.balance } });

  } catch (error) {
    console.error("❌ Error processing settlement:", error);
    res.status(500).json({ error: "Error settling up", details: error.message });
  }
};
