import Chapter from "../Models/Chapter.js";
import redisClient from "../Config/redis.js"; 
import mongoose from "mongoose";

class ChapterController {
    /**
     * GET /api/v1/chapters
     */
    getAllChapters = async (req, res) => {
        try {
        const {
            subject,
            className,
            unit,
            status,
            isWeakChapter,
            page = 1,
            limit = 10,
        } = req.query;

        const redisKey = `chapters:${JSON.stringify(req.query)}`;

        // Try fetching from Redis cache
        const cachedData = await redisClient.get(redisKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        // Build MongoDB query
        const filter = {};
        if (subject) filter.subject = subject;
        if (className) filter.class = className;
        if (unit) filter.unit = unit;
        if (status) filter.status = status;
        if (isWeakChapter !== undefined) {
            filter.isWeakChapter = isWeakChapter === "true";
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [chapters, totalChapters] = await Promise.all([
            Chapter.find(filter).skip(skip).limit(Number(limit)),
            Chapter.countDocuments(filter),
        ]);

        const response = {
            success: true,
            data: chapters,
            totalChapters,
            currentPage: Number(page),
            totalPages: Math.ceil(totalChapters / Number(limit)),
        };

        // Cache in Redis
        await redisClient.set(redisKey, JSON.stringify(response), "EX", 3600); // 1 hour

        return res.status(200).json(response);
        } catch (error) {
        console.log("Error in controller layer!");
        console.error("Error fetching chapters:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        }
    };

    /**
     * GET /api/v1/chapters/:id
     */
    getChapterById = async (req, res) => {
        try {
            const { id } = req.params;

            // Validate MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chapter ID",
            });
            }

            const chapter = await Chapter.findById(id);

            if (!chapter) {
            return res.status(404).json({
                success: false,
                message: "Chapter not found",
            });
            }

            return res.status(200).json({
            success: true,
            data: chapter,
            });
        } catch (error) {
            console.error("Error fetching chapter by ID:", error);
            return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            });
        }
    }

    /**
     * POST /api/v1/chapters
     * 
     */
    uploadChapters = async (req, res) => {
        try {
            // Check if the request has a file
          if (!req.file) {
            return res
              .status(400)
              .json({ success: false, message: "No file uploaded" });
          }

          const buffer = req.file.buffer;
          const jsonString = buffer.toString("utf8");

          let chaptersArray;
          try {
            chaptersArray = JSON.parse(jsonString);
            if (!Array.isArray(chaptersArray))
              throw new Error("Invalid format");
          } catch (e) {
            console.error("Error parsing JSON file:", e);
            return res
              .status(400)
              .json({ success: false, message: "Invalid JSON file" });
          }

          const failedChapters = [];
          const validChapters = [];

          for (const item of chaptersArray) {
            const chapter = new Chapter(item);

            try {
              await chapter.validate(); // Only validate, don’t save yet
              validChapters.push(chapter);
            } catch (err) {
              failedChapters.push({
                chapter: item.chapter,
                error: err.message,
              });
            }
          }

          if (validChapters.length > 0) {
            await Chapter.insertMany(validChapters);
            await redisClient.flushall(); // Clear all cache as a quick invalidation strategy
          }

          return res.status(200).json({
            success: true,
            insertedCount: validChapters.length,
            failedCount: failedChapters.length,
            failedChapters,
          });
        } catch (error) {
          console.error("Error uploading chapters:", error);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
    }
}


const chapterController = new ChapterController();
export default chapterController;