exports.generateReport = async (req, res) => {
    try {
        res.status(200).json({ message: "Report generated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
