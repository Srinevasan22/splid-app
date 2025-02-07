const mongoose = require('mongoose');
const Participant = require('../models/participantmodel');
const Settlement = require('../models/settlementmodel'); // ✅ Added Settlement model for logging transactions

exports.settleUp = async (req, res) => {
  try {
      const { payerId, receiverId, amount, paymentMethod } = req.body; // ✅ Added payment method
      const { sessionId } = req.params;  // ✅ Get sessionId from URL parameters

      if (!sessionId || !payerId || !receiverId || !amount || !paymentMethod) {
        return res.status(400).json({ error: "Session ID, payerId, receiverId, amount, and payment method are required" });
      }

      if (!mongoose.Types.ObjectId.isValid(sessionId) || !mongoose.Types.ObjectId.isValid(payerId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ error: "Invalid session ID, payerId, or receiverId format" });
      }

      const payer = await Participant.findById(payerId);
      const receiver = await Participant.findById(receiverId);

      if (!payer || !receiver || payer.sessionId.toString() !== sessionId || receiver.sessionId.toString() !== sessionId) {
        return res.status(400).json({ error: "Invalid payer or receiver ID or they do not belong to this session." });
      }

      // ✅ Update balances correctly
      payer.balance = (payer.balance || 0) - amount;
      receiver.balance = (receiver.balance || 0) + amount;

      await payer.save();
      await receiver.save();

      // ✅ Log the settlement transaction
      const settlement = new Settlement({
        sessionId,
        fromUserId: payerId,
        toUserId: receiverId,
        amount,
        currency: "USD", // Default currency, can be dynamic
        paymentMethod,
        date: new Date() // ✅ Added timestamp for settlement record
      });
      await settlement.save();

      // ✅ Fetch updated balances after saving to return correct values
      const updatedPayer = await Participant.findById(payerId);
      const updatedReceiver = await Participant.findById(receiverId);

      res.status(200).json({
        message: "Settlement successful",
        settlementId: settlement._id, // ✅ Return settlement ID
        balances: {
          [payerId]: updatedPayer.balance,
          [receiverId]: updatedReceiver.balance
        },
        settlementDetails: settlement // ✅ Return full settlement details
      });
  } catch (error) {
    console.error("Error settling up:", error);
    res.status(500).json({ error: "Error settling up", details: error.message });
  }
};

// ✅ Fetch all settlements for a session
exports.getSessionSettlements = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: "Invalid session ID format" });
    }
    const settlements = await Settlement.find({ sessionId }).populate("fromUserId toUserId");
    res.status(200).json(settlements);
  } catch (error) {
    console.error("Error retrieving settlements:", error);
    res.status(500).json({ error: "Error retrieving settlements", details: error.message });
  }
};