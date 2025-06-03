import request from "supertest";
import app from "../app.js";
import Chapter from "../Models/Chapter.js";
import { connectTestDB, disconnectTestDB } from "./setupTestDb.js";
import path from "path";
import fs from "fs";

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await Chapter.deleteMany({});
});

describe("Chapter API Integration Tests", () => {
  describe("GET /api/v1/chapters", () => {
    it("should return an empty list if no chapters exist", async () => {
      const res = await request(app).get("/api/v1/chapters");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(0);
      expect(res.body.totalChapters).toBe(0);
    });
    it("should return chapters with pagination", async () => {
      await Chapter.insertMany([
        {
          subject: "Physics",
          chapter: "Gravitation",
          class: "12",
          unit: "Unit 1",
          yearWiseQuestionCount: { 2021: 10 },
          questionSolved: 4,
          status: "Completed",
          isWeakChapter: false,
        },
        {
          subject: "Chemistry",
          chapter: "Organic Chemistry",
          class: "11",
          unit: "Unit 2",
          yearWiseQuestionCount: { 2022: 8 },
          questionSolved: 3,
          status: "In Progress",
          isWeakChapter: true,
        },
      ]);

      const res = await request(app).get("/api/v1/chapters?page=1&limit=2");
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.totalChapters).toBe(2);
      expect(res.body.totalPages).toBe(1);
    });

    it("should filter by subject and return matching results", async () => {
      await Chapter.insertMany([
        {
          subject: "Math",
          chapter: "Trigonometry",
          class: "10",
          unit: "Unit 3",
          yearWiseQuestionCount: { 2020: 12 },
          questionSolved: 6,
          status: "Not Started",
          isWeakChapter: false,
        },
        {
          subject: "Math",
          chapter: "Algebra",
          class: "10",
          unit: "Unit 1",
          yearWiseQuestionCount: { 2020: 10 },
          questionSolved: 5,
          status: "Completed",
          isWeakChapter: true,
        },
        {
          subject: "Physics",
          chapter: "Optics",
          class: "11",
          unit: "Unit 4",
          yearWiseQuestionCount: { 2021: 7 },
          questionSolved: 3,
          status: "In Progress",
          isWeakChapter: false,
        },
      ]);

      const res = await request(app).get("/api/v1/chapters?subject=Math");
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.totalChapters).toBe(2);
    });
  });

  describe("GET /api/v1/chapters/:id", () => {
    it("should return 400 for invalid Mongo ID", async () => {
      const res = await request(app).get("/api/v1/chapters/invalid-id");
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid chapter id/i);
    });

    it("should return 404 for non-existing valid ID", async () => {
      const validId = "60c72b2f9b1e8a3d5cf2a1ad"; // any valid ObjectId format
      const res = await request(app).get(`/api/v1/chapters/${validId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/chapter not found/i);
    });

    it("should return a single chapter by valid ID", async () => {
      const chapter = await Chapter.create({
        subject: "Biology",
        chapter: "Genetics",
        class: "12",
        unit: "Unit 5",
        yearWiseQuestionCount: { 2023: 9 },
        questionSolved: 4,
        status: "Completed",
        isWeakChapter: false,
      });

      const res = await request(app).get(`/api/v1/chapters/${chapter._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty("chapter", "Genetics");
    });
  });
});

describe("POST /api/v1/chapters", () => {

  it("should insert valid chapters and return failed ones", async () => {
    const filePath = path.join(path.resolve(), "src/Tests/utils/sampleUpload.json");
    
    const res = await request(app)
      .post("/api/v1/chapters")
      .set("x-admin", "true")
      .attach("file", filePath);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.insertedCount).toBe(1);
    expect(res.body.failedCount).toBe(1);
    expect(res.body.failedChapters[0]).toHaveProperty("chapter");
    expect(res.body.failedChapters[0]).toHaveProperty("error");
  });

  it("should reject upload without x-admin header", async () => {
    const filePath = path.join(
      path.resolve(),
      "src/Tests/utils/sampleUpload.json"
    );
    const fileBuffer = fs.readFileSync(filePath); // ✅ Read as buffer
    const res = await request(app)
      .post("/api/v1/chapters")
      .attach("file", fileBuffer, {
        filename: "sampleUpload.json",
        contentType: "application/json",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/access denied/i);
  });
});
