const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists, please log in", success: false });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new UserModel({ 
            name, 
            email, 
            password: hashedPassword  // Store the hashed password
        });

        // Save user in the database
        await newUser.save();

        res.status(201).json({ message: "Signup successful", success: true });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required", success: false });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(403).json({ message: "Invalid email or password", success: false });
        }

        if (!user.password) {
            console.error("User password is missing:", user);
            return res.status(500).json({ message: "Server error: Missing password field", success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);

        if (!isPassEqual) {
            return res.status(403).json({ message: "Invalid email or password", success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            name: user.name
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


module.exports = {
    signup,
    login
};
