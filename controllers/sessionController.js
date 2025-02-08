const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = "splidDB"; // Your database name
let db;

// ✅ Connect to MongoDB and Store the Connection
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log("✅ Connected to MongoDB (Native Driver)");
        db = client.db(dbName);
    })
    .catch(error => console.error("❌ MongoDB Connection Error:", error));


exports.addSession = async (req, res) => {
    try {
        console.log("🔍 Incoming Request Headers:", req.headers);
        console.log("🔍 Incoming Request Body:", req.body);

        const { name, email } = req.body;

        console.log("✅ Extracted Name:", name);
        console.log("✅ Extracted Email:", email);

        if (!req.body || Object.keys(req.body).length === 0) {
            console.error("🚨 ERROR: `req.body` is empty! Express is not parsing JSON.");
            return res.status(400).json({ message: "Invalid request: Request body is empty." });
        }

        if (!email) {
            console.error("🚨 Email is missing! Request body:", req.body);
            return res.status(400).json({ message: "Email is required in request body." });
        }

        console.log("✅ Creating session with:", { name, email });

        // ✅ Use the `db` variable that was already created at the top
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
