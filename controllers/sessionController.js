exports.addSession = async (req, res) => {
    try {
        console.log("🔍 Checking request body:", req.body);
        console.log("🔍 Checking user authentication:", req.user);

        // Extract name and email
        const { name } = req.body;
        let email = req.body.email || req.user.email;

        // 🚨 Log email before proceeding
        console.log("✅ Email from req.body:", req.body.email);
        console.log("✅ Email from req.user:", req.user.email);
        console.log("✅ Final email being used:", email);

        // If email is missing, return an error
        if (!email) {
            console.error("🚨 Email is missing in request body AND req.user!", req.body, req.user);
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

        // Validate before saving
        newSession.validate((error) => {
            if (error) {
                console.error("❌ Validation failed:", error.errors);
                return res.status(400).json({ message: "Session validation failed", error: error.errors });
            } else {
                console.log("✅ Session is ready to be saved!");
            }
        });

        // 🚨 Hardcoded email test (uncomment if debugging)
        // newSession.email = "debug-email@example.com";

        await newSession.save();
        res.status(201).json({ message: "Session created successfully", session: newSession });
    } catch (error) {
        console.error("❌ Error creating session:", error);
        res.status(500).json({ message: "Error creating session", error: error.message });
    }
};
