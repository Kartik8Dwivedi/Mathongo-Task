import Chapter from "../Models/Chapter.js";
import redisClient from "../Config/redis.js"; 

class ChapterController {
  /**
   * GET /api/v1/chapters
   */
  getAllChapters = async (req, res) => {
    try {
      const {
        subject,
        class: className,
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
}


const chapterController = new ChapterController();
export default chapterController;