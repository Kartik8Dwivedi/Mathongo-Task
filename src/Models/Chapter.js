import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    chapter: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: String,
      required: true,
      index: true,
    },
    unit: {
      type: String,
      required: true,
      index: true,
    },
    yearWiseQuestionCount: {
      type: Map,
      of: Number,
      required: true,
    },
    questionSolved: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      required: true,
      index: true,
    },
    isWeakChapter: {
      type: Boolean,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

chapterSchema.pre("save", function (next) {
  if (this.chapter) {
    this.chapter = this.chapter
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  next();
});

const Chapter = mongoose.model("Chapter", chapterSchema);
export default Chapter;
