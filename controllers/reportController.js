exports.exportReport = async (req, res) => {
    try {
        res.status(200).json({ message: "Report exported successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};