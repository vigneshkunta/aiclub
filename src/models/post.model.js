import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scenario: { type: String, required: true },
    poem: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    showScenarioPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
