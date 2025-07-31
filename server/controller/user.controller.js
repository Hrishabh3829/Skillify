export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const user = new User({ name, email, password, role });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}