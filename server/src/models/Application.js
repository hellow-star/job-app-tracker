import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: String,
  link: String,
  dateApplied: { type: Date, default: Date.now },
  status: { type: String, enum: ["applied","interview","offer","rejected"], default: "applied" },
  notes: String,
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
