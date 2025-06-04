# 📘 Chapter Performance Dashboard API (MathonGo)

A robust, production-grade RESTful API for uploading, querying, and managing academic chapter performance.  
Built using Node.js, Express, MongoDB, and Redis — with full support for filtering, pagination, validation, rate-limiting, and caching.

> 🛠️ Designed for real-world scale. Fully tested, documented, and optimized.

---

## 🚀 Features


- ✅ Bulk upload chapters via JSON file (Admin-only access)
- ✅ Filter chapters by class, unit, subject, status, and weak chapters
- ✅ Pagination support with total count returned
- ✅ Redis-based caching for high-performance GET queries
- ✅ Redis-backed rate limiting (30 requests/min/IP)
- ✅ Swagger documentation at `/api-docs`
- ✅ Public Postman collection with examples
- ✅ Integration tested using Jest, Supertest & MongoMemoryServer
- ✅ Global error handling and logging with Morgan
- ✅ Docker support for easy deployment (Simply run `sudo docker compose up --build`)
- ✅ CI/CD workflow with GitHub Actions.
- ✅ Deployed on AWS EC2 with MongoDB Atlas and Redis Cloud
- ✅ Environment variables for configuration
- ✅ Fully isolated test environment using mongodb-memory-server
- ✅ Admin-only upload route with access control
- ✅ Rate limiting to prevent abuse
- ✅ Comprehensive API documentation with Swagger UI
- ✅ Detailed Postman collection for easy testing: [[Postman Collection]](https://www.postman.com/avionics-pilot-26434826/mathongo/collection/5cwakth/chapter-performance-dashboard-api-mathongo?action=share&creator=27331979)

---

## 🧱 Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- Redis (Cloud or local)
- Swagger (API documentation)
- Jest + Supertest (integration testing)

---

## 📁 API Endpoints

| Method | Endpoint               | Description                           |
|--------|------------------------|---------------------------------------|
| GET    | `/api/v1/chapters`     | List chapters with filters + pagination |
| GET    | `/api/v1/chapters/:id` | Get a single chapter by ID            |
| POST   | `/api/v1/chapters`     | Upload JSON file (Admin only)         |

🛡️ To access the upload route, provide the header:

```http
x-admin: true
```

Refer to Swagger or Postman for detailed schemas and examples.

---

## 📄 API Documentation

📚 Swagger UI: http://localhost:5000/api-docs

📬 Postman Collection:  [Link](https://www.postman.com/avionics-pilot-26434826/mathongo/collection/5cwakth/chapter-performance-dashboard-api-mathongo?action=share&creator=27331979 "Postman Collection Docs")

---

## 🦪 Running Tests

🛼 Fully isolated environment using mongodb-memory-server.

```bash
npm test
```

Tests:
- GET /chapters with filtering & pagination
- GET /chapters/:id with valid & invalid IDs
- POST /chapters (file upload, validation, and access control)
- Redis interactions mocked for test reliability

---

## ⚙️ Local Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/Kartik8Dwivedi/Mathongo-Task.git
   cd Mathongo-Task
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env file in the root:

   ```env
   PORT=5000
   MONGODB_URI=your-mongo-uri
   REDIS_HOST=your-redis-host
   REDIS_PORT=your-redis-port
   REDIS_PASSWORD=your-redis-password
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Visit:  
   ```bash
   http://localhost:5000/api-docs  
   http://localhost:5000/api/v1/chapters
   ```
---

## 🐋 Docker

To build and run the app using Docker:

1. Build the image:

```bash
docker build -t chapter-api .
```

2. Run the container (attach .env if needed):

```bash
docker run -p 5000:5000 --env-file .env chapter-api
```

Now visit:

- http://localhost:5000/api/v1/chapters
- http://localhost:5000/api-docs

3. For development with live reload (optional):

```bash
docker run -p 5000:5000 -v $(pwd):/app --env-file .env chapter-api
```

---

## 🚀 Deployment 

- Deployed on AWS EC2 (t3.micro free-tier), MongoDB Atlas, and Redis Cloud
- Used PM2 for process management
- Used Nginx as a reverse proxy
- CI/CD with GitHub Actions (optional)
- Dockerized for easy deployment
- Link for the deployed app: [[Deployed EC2 Instance]](http://ec2-65-0-176-45.ap-south-1.compute.amazonaws.com/api-docs/)
- Link for Public EC2 instance: [[Link for Public EC2 IP]](http://65.0.176.45/api-docs/)
- CI/CD enabled with your real EC2 SSH key


---

## 📆 Overall Features

| Feature             | Status      |
|---------------------|-------------|
| Swagger docs        | ✅ Completed |
| Integration tests   | ✅ Completed |
| Global error handler| ✅ Included |
| Rate limiter        | ✅ Redis-based |
| Logging             | ✅ Morgan middleware |
| Dockerfile          | ✅ Generated |
| CI/CD (GitHub)      | ✅ Workflow Implemented |

---

## 🙌 Final Notes

This project is built with real-world scalability, clarity, and performance in mind — ready to serve as a production backend or a showcase project.

Pull requests and feedback welcome!

---
