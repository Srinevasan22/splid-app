const ActivityLog = require('../models/activityLogmodel');
const Report = require('../models/reportmodel');
const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.logAction = async (userId, action, details = {}) => {
    const logEntry = new ActivityLog({ userId, action, details });
    await logEntry.save();
};

exports.getLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find().sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        await Group.findByIdAndDelete(id);
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { read: true });
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.exportReport = async (req, res) => {
    try {
        const doc = new PDFDocument();
        const fileName = `report_${Date.now()}.pdf`;
        const filePath = `./reports/${fileName}`;

        if (!fs.existsSync('./reports')) {
            fs.mkdirSync('./reports');
        }

        doc.pipe(fs.createWriteStream(filePath));
        doc.fontSize(20).text("Expense Report", { align: "center" });
        doc.moveDown();

        const reports = await Report.find();
        reports.forEach((report, index) => {
            doc.fontSize(12).text(`${index + 1}. Type: ${report.reportType}, Generated By: ${report.generatedBy}, Date: ${report.createdAt}`);
            doc.moveDown();
        });

        doc.end();
        res.status(200).json({ message: "Report generated successfully", filePath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
