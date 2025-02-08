const { MongoClient } = require("mongodb");
require("dotenv").config();

// Connect to MongoDB (Ensure URI is set in `.env` file)
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = "splidDB"; // Your database name
let db;

MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log("✅ Connected to MongoDB (Native Driver)");
        db = client.db(dbName);
    })
    .catch(error => console.error("❌ MongoDB Connection Error:", error));

exports.addSession = async (req, res) => {
    try {
        console.log("🔍 Incoming request body:", req.body);

        const { name, email } = req.body;

        if (!email) {
            console.error("🚨 Email is missing! Request body:", req.body);
            return res.status(400).json({ message: "Email is required in request body." });
        }

        if (!name) {
            return res.status(400).json({ message: "Session name is required" });
        }

        console.log("✅ Creating session with:", { name, email });

        const result = await db.collection("sessions").insertOne({
            name,
            email,
            participants: [email],
            createdAt: new Date(),
        });

        console.log("✅ Session created successfully:", result.ops[0]);

        res.status(201).json({ message: "Session created successfully", session: result.ops[0] });
    } catch (error) {
        console.error("❌ Error creating session:", error);
        res.status(500).json({ message: "Error creating session", error: error.message });
    }
};
