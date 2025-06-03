// src/docs/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
console.log("Setting up Swagger documentation...");
// console.log("Current directory:", __dirname);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chapter Performance Dashboard API",
      version: "1.0.0",
      description:
        "A high-performance, scalable API for managing academic chapter data. " +
        "Supports bulk upload (JSON), filtering, pagination, Redis caching, and rate limiting.",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Local development server",
      },
      // If you deploy, add your production URL here, e.g.:
      // { url: "https://your-production-url.com/api/v1", description: "Production server" },
    ],
    components: {
      schemas: {
        Chapter: {
          type: "object",
          required: [
            "subject",
            "chapter",
            "class",
            "unit",
            "yearWiseQuestionCount",
            "questionSolved",
            "status",
            "isWeakChapter",
          ],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated ID of the chapter (ObjectId).",
              example: "60c72b2f9b1e8a3d5cf2a1ad",
            },
            subject: {
              type: "string",
              description: "Subject name (e.g., Physics, Chemistry).",
              example: "Physics",
            },
            chapter: {
              type: "string",
              description: "Chapter title/name.",
              example: "Electricity and Magnetism",
            },
            class: {
              type: "string",
              description: "Class or grade (e.g., Class 11, Class 12).",
              example: "Class 12",
            },
            unit: {
              type: "string",
              description: "Unit number or name within the subject.",
              example: "Unit 3",
            },
            yearWiseQuestionCount: {
              type: "object",
              description:
                "A map where keys are years (e.g., 2019, 2020, …) and values are number of questions.",
              additionalProperties: { type: "integer", example: 5 },
              example: { 2019: 10, 2020: 12, 2021: 8 },
            },
            questionSolved: {
              type: "integer",
              description:
                "Number of questions solved from this chapter so far.",
              example: 35,
            },
            status: {
              type: "string",
              enum: ["Not Started", "In Progress", "Completed"],
              description: "Progress status of the chapter.",
              example: "In Progress",
            },
            isWeakChapter: {
              type: "boolean",
              description:
                "Indicates if this is a 'weak' chapter (true/false).",
              example: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the chapter was created.",
              example: "2025-05-30T14:12:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the chapter was last updated.",
              example: "2025-05-30T15:22:45.000Z",
            },
          },
        },
        ChapterListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Chapter" },
            },
            totalChapters: { type: "integer", example: 120 },
            currentPage: { type: "integer", example: 1 },
            totalPages: { type: "integer", example: 12 },
          },
        },
        ChapterDetailResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/Chapter" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },
        UploadResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            insertedCount: { type: "integer", example: 18 },
            failedCount: { type: "integer", example: 2 },
            failedChapters: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  chapter: { type: "string", example: "Thermodynamics" },
                  error: {
                    type: "string",
                    example: "Status is required or invalid",
                  },
                },
              },
            },
          },
        },
      },
      parameters: {
        PageParam: {
          name: "page",
          in: "query",
          description: "Page number (default 1)",
          required: false,
          schema: { type: "integer", default: 1, minimum: 1 },
        },
        LimitParam: {
          name: "limit",
          in: "query",
          description: "Number of items per page (default 10)",
          required: false,
          schema: { type: "integer", default: 10, minimum: 1 },
        },
        SubjectParam: {
          name: "subject",
          in: "query",
          description: "Filter by subject name (exact match).",
          required: false,
          schema: { type: "string", example: "Physics" },
        },
        ClassParam: {
          name: "class",
          in: "query",
          description: "Filter by class/grade (exact match).",
          required: false,
          schema: { type: "string", example: "Class 12" },
        },
        UnitParam: {
          name: "unit",
          in: "query",
          description: "Filter by unit within a subject.",
          required: false,
          schema: { type: "string", example: "Unit 3" },
        },
        StatusParam: {
          name: "status",
          in: "query",
          description:
            "Filter by progress status (Not Started | In Progress | Completed).",
          required: false,
          schema: {
            type: "string",
            enum: ["Not Started", "In Progress", "Completed"],
            example: "In Progress",
          },
        },
        IsWeakParam: {
          name: "isWeakChapter",
          in: "query",
          description: "Filter by whether chapter is weak (true/false).",
          required: false,
          schema: { type: "boolean", example: false },
        },
        ChapterIdParam: {
          name: "id",
          in: "path",
          description: "The unique ObjectId of the chapter.",
          required: true,
          schema: { type: "string", example: "60c72b2f9b1e8a3d5cf2a1ad" },
        },
      },
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-admin",
          description:
            "Admin access flag. Include `x-admin: true` for POST /chapters.",
        },
      },
    },
    security: [],
    tags: [
      {
        name: "Chapters",
        description: "Operations related to chapters",
      },
    ],
  },
  apis: [path.resolve(__dirname, "../Routes/v1/chapter/*.js")], // Point to where you put the JSDoc annotations
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📝 Swagger docs available at /api-docs");
}

export default setupSwagger;
