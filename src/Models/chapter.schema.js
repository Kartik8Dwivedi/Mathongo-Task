import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    class: { type: String, required: true },
    unit: { type: String, required: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ["complete", "incomplete"], required: true },
    weakChapter: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Chapter = mongoose.model("Chapter", chapterSchema);
export default Chapter;
