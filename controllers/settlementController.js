const mongoose = require('mongoose');
const Participant = require('../models/participantmodel');

exports.settleUp = async (req, res) => {
  try {
      const { payerId, receiverId, amount } = req.body;
      const { sessionId } = req.params;  // ✅ Get sessionId from URL parameters

      if (!sessionId || !payerId || !receiverId || !amount) {
        return res.status(400).json({ error: "Session ID, payerId, receiverId, and amount are required" });
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

    // ✅ Fetch updated balances after saving to return correct values
    const updatedPayer = await Participant.findById(payerId);
    const updatedReceiver = await Participant.findById(receiverId);

    res.status(200).json({
      message: "Settlement successful",
      balances: {
        [payerId]: updatedPayer.balance,
        [receiverId]: updatedReceiver.balance
      }
    });
  } catch (error) {
    console.error("Error settling up:", error);
    res.status(500).json({ error: "Error settling up", details: error.message });
  }
};
