const express = require("express");
const router = express.Router();
const User = require("../models/User"); 

const authMiddleware = require("../middleware/authMiddleware");

// Agar aapke middleware directly export hote hain ya object ke roop mein, dono ko handle karne ke liye safe check:
const protect = authMiddleware.protect || authMiddleware; 
const admin = authMiddleware.admin || ((req, res, next) => {
    // Fallback: Agar admin middleware aapke file me alag se nahi bana hai, toh ye inline check karega
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
});

/**
 * @route   GET /api/admin/clients
 * @desc    Get all registered clients for the Admin invoice creator dropdown
 * @access  Private/Admin
 */
router.get("/clients", protect, admin, async (req, res) => {
    try {
        // Database se sirf name, email, aur id uthayenge taaki client separation secure rahe
        const clients = await User.find({ role: "client" }).select("_id name email");
        res.status(200).json(clients);
    } catch (error) {
        console.error("Zero-Trust Log Error:", error);
        res.status(500).json({ message: "Server Error fetching clients ledger" });
    }
});

module.exports = router;