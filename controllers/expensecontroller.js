const mongoose = require('mongoose');
const Expense = require('../models/expensemodel'); // Updated to lowercase singular
const Participant = require('../models/participantmodel'); // Updated to lowercase singular
const PDFDocument = require('pdfkit'); // Import PDF generation library

// ✅ Add a new expense
exports.addExpense = async (req, res) => {
  try {
    console.log("✅ Received request to add expense:");
    console.log("➡️ Request body:", req.body);
    console.log("➡️ Request params:", req.params);

    const { sessionId } = req.params;
    const { description, amount, paidBy, splitAmong } = req.body;

    if (!sessionId || !description || !amount || !paidBy || !splitAmong) {
      console.error("❌ Missing required fields.");
      return res.status(400).json({ error: "Session ID, description, amount, paidBy, and splitAmong are required" });
    }

    console.log("✅ Extracted sessionId:", sessionId);
    console.log("✅ Validating sessionId format...");

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      console.error("❌ Invalid sessionId format:", sessionId);
      return res.status(400).json({ error: "Invalid session ID format" });
    }

    console.log("✅ Validating paidBy format:", paidBy);
    if (!mongoose.Types.ObjectId.isValid(paidBy)) {
      console.error("❌ Invalid paidBy format:", paidBy);
      return res.status(400).json({ error: "Invalid paidBy ID format" });
    }

    console.log("✅ Validating splitAmong participant IDs...");
    for (const participantId of splitAmong) {
      if (!mongoose.Types.ObjectId.isValid(participantId)) {
        console.error(`❌ Invalid participantId format: ${participantId}`);
        return res.status(400).json({ error: "Invalid splitAmong participant ID format" });
      }
    }

    console.log("✅ Creating expense with validated data...");

    const newExpense = new Expense({
      sessionId,
      description,
      amount,
      paidBy,
      splitAmong
    });

    await newExpense.save();

    console.log("✅ Expense added successfully:", newExpense);
    res.status(201).json({ message: "Expense added successfully", expense: newExpense });
  } catch (error) {
    console.error("❌ Error adding expense:", error);
    res.status(500).json({ error: "Error adding expense", details: error.message });
  }
};




// ✅ Get all expenses for a session
exports.getExpensesBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: "Invalid session ID format" });
    }

    const expenses = await Expense.find({ sessionId })
      .populate('paidBy', 'name email') // Populate paidBy field with participant details
      .populate('splitAmong', 'name email'); // Populate splitAmong array with participant details

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    res.status(500).json({ error: "Error retrieving expenses", details: error.message });
  }
};

// ✅ Calculate the balance for each participant in a session
exports.calculateBalance = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: "Invalid session ID format" });
    }

    const participants = await Participant.find({ sessionId });
    const expenses = await Expense.find({ sessionId });

    const balances = {};
    participants.forEach(participant => {
      balances[participant._id] = { name: participant.name, balance: 0 };
    });

    expenses.forEach(expense => {
      const amountPerPerson = expense.amount / expense.splitAmong.length;

      if (balances[expense.paidBy]) {
        balances[expense.paidBy].balance += expense.amount;
      }

      expense.splitAmong.forEach(participantId => {
        if (balances[participantId]) {
          balances[participantId].balance -= amountPerPerson;
        }
      });
    });

    res.status(200).json(balances);
  } catch (error) {
    console.error("Error calculating balances:", error);
    res.status(500).json({ error: "Error calculating balances", details: error.message });
  }
};

// ✅ Settle up between two participants
exports.settleUp = async (req, res) => {
  try {
    const { sessionId, payerId, receiverId, amount } = req.body;

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

    payer.balance -= amount;
    receiver.balance += amount;

    await payer.save();
    await receiver.save();

    res.status(200).json({ message: "Settlement successful", balances: { [payerId]: payer.balance, [receiverId]: receiver.balance } });
  } catch (error) {
    console.error("Error settling up:", error);
    res.status(500).json({ error: "Error settling up", details: error.message });
  }
};

// ✅ Generate a session report as a PDF
exports.generateSessionReport = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: "Invalid session ID format" });
    }

    const expenses = await Expense.find({ sessionId });
    const participants = await Participant.find({ sessionId });

    const reportData = {
      totalExpenses: expenses.reduce((acc, expense) => acc + expense.amount, 0),
      participants: {},
      expenses: expenses.map(expense => ({
        description: expense.description,
        amount: expense.amount,
        paidBy: expense.paidBy,
        splitAmong: expense.splitAmong,
      })),
    };

    participants.forEach(participant => {
      reportData.participants[participant._id] = { name: participant.name, balance: 0 };
    });

    expenses.forEach(expense => {
      const amountPerPerson = expense.amount / expense.splitAmong.length;

      if (reportData.participants[expense.paidBy]) {
        reportData.participants[expense.paidBy].balance += expense.amount;
      }

      expense.splitAmong.forEach(participantId => {
        if (reportData.participants[participantId]) {
          reportData.participants[participantId].balance -= amountPerPerson;
        }
      });
    });

    // Generate PDF Report
    const doc = new PDFDocument();
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res.contentType('application/pdf');
      res.send(pdfData);
    });

    doc.fontSize(20).text('Session Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Session ID: ${sessionId}`);
    doc.text(`Total Expenses: $${reportData.totalExpenses.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(16).text('Participants Balances:');
    Object.keys(reportData.participants).forEach(participantId => {
      const participant = reportData.participants[participantId];
      doc.fontSize(12).text(`${participant.name}: $${participant.balance.toFixed(2)}`);
    });

    doc.moveDown();
    doc.fontSize(16).text('Expenses:');
    reportData.expenses.forEach(expense => {
      doc.fontSize(12).text(`- ${expense.description}: $${expense.amount.toFixed(2)}, Paid by ${expense.paidBy}, Split among ${expense.splitAmong.join(', ')}`);
    });

    doc.end();

  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Error generating report", details: error.message });
  }
};
