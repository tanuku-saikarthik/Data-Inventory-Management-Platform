// routes/auditLogRoutes.js
import express from "express";
import AuditLog from "../models/audit.js";
import authenticate from "../middleware/authMidddleware.js";

const router = express.Router();

// Admin route to fetch all audit logs
router.get("/logs", authenticate, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }); // Sort by most recent
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching audit logs" });
  }
});

export default router;
