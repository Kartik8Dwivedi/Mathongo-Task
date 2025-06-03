import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import Chapter from "../Models/Chapter.js";
// import Config from "../Config/serverConfig.js";

dotenv.config();

const seedChapters = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const dataPath = path.resolve(
      new URL(import.meta.url).pathname,
      "../data.json"
    );
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    await Chapter.insertMany(data);
    console.log("✅ Data uploaded to MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to upload data:", err);
    process.exit(1);
  }
};

seedChapters();
