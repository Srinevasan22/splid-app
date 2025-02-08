exports.addSession = async (req, res) => {
    try {
        console.log("🔍 Checking request body:", req.body);

        // Extract name and email from request body instead of relying on JWT
        const { name, email } = req.body;

        // 🚨 Log email before proceeding
        console.log("✅ Email from req.body:", email);

        // If email is missing, return an error
        if (!email) {
            console.error("🚨 Email is missing in request body!", req.body);
            return res.status(400).json({ message: "Email is required in request body." });
        }

        if (!name) {
            return res.status(400).json({ message: "Session name is required" });
        }

        // Log session details before saving
        console.log("✅ Creating session with:", { name, email });

        const newSession = new Session({
            name: name,
            email: email, // Explicitly pass email
            participants: [email],
            createdAt: new Date()
        });

        console.log("✅ New session object before saving:", newSession.toObject());

        await newSession.save();

        res.status(201).json({ message: "Session created successfully", session: newSession });
    } catch (error) {
        console.error("❌ Error creating session:", error);
        res.status(500).json({ message: "Error creating session", error: error.message });
    }
};
