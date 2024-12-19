// utils/logAction.js
import AuditLog from '../models/audit.js';

export const logAction = async (userId, action, target, details) => {
  try {
    const log = new AuditLog({
      userId,
      action,
      target,
      details,
    });
    await log.save();
  } catch (error) {
    console.error("Error logging action:", error);
  }
};
