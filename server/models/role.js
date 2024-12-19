import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true },
  permissions: { type: [String], required: true }, // e.g., ['READ', 'WRITE', 'DELETE']
});

export const Role = mongoose.model("Role", roleSchema);
