# Vidhya Backend API

Production-ready Node.js + Express + MongoDB backend for the **Vidhya** AI study platform (NEET / JEE / Boards).

---

## 📁 Project Structure

```
vidhya-backend/
├── logs/                        # Winston log files (auto-created)
├── src/
│   ├── server.js                # Entry point – boots server
│   ├── app.js                   # Express app factory (middleware + routes)
│   ├── config/
│   │   └── database.js          # Mongoose connection
│   ├── controllers/
│   │   ├── auth.controller.js   # signup, login, Google OAuth, /me
│   │   ├── user.controller.js   # CRUD for users (admin + self)
│   │   ├── flashcard.controller.js
│   │   ├── studyPlan.controller.js
│   │   ├── progress.controller.js
│   │   └── upload.controller.js
│   ├── middleware/
│   │   ├── auth.js              # protect() + authorize() guards
│   │   ├── errorHandler.js      # Global Express error handler
│   │   ├── upload.js            # Multer file upload config
│   │   └── validate.js          # express-validator result handler
│   ├── models/
│   │   ├── User.js              # bcrypt hashing, role enum
│   │   ├── Flashcard.js         # Spaced-repetition flashcards
│   │   ├── StudyPlan.js         # Weekly schedule sessions
│   │   └── Progress.js          # Chapter % + streak + milestones
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── flashcard.routes.js
│   │   ├── studyPlan.routes.js
│   │   ├── progress.routes.js
│   │   └── upload.routes.js
│   ├── uploads/                 # Uploaded files (served statically)
│   └── utils/
│       ├── apiResponse.js       # sendSuccess / sendError helpers
│       ├── jwt.js               # generateToken / verifyToken
│       └── logger.js            # Winston logger
├── .env.example                 # Copy to .env and fill in values
├── .gitignore
└── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** 18+ — https://nodejs.org
- **MongoDB** 6+ (local) or a free **MongoDB Atlas** cluster — https://mongodb.com/atlas

### 1. Clone / place the project

```bash
cd vidhya-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string (run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`) |
| `JWT_EXPIRES_IN` | Token lifetime e.g. `7d` |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console (for social login) |
| `CLIENT_URL` | Frontend origin e.g. `http://localhost:3000` |
| `PORT` | API port (default `5000`) |

### 4. Run the server

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

You should see:
```
[HH:mm:ss] info: 🗄️  MongoDB connected: localhost
[HH:mm:ss] info: ✅  Vidhya server running on http://localhost:5000
```

### 5. Health check

```
GET http://localhost:5000/health
→ { "success": true, "message": "Vidhya API is healthy 🚀" }
```

---

## 🔒 Security Features

| Feature | Implementation |
|---|---|
| Password hashing | bcrypt with 12 salt rounds |
| JWT auth | HS256, configurable expiry |
| Role-based access | `protect` + `authorize('admin')` middleware |
| Rate limiting | 100 req / 15 min globally; 20 req / 15 min on auth routes |
| Security headers | Helmet.js |
| Input validation | express-validator on every POST/PATCH |
| CORS | Whitelist via `CLIENT_URL` env var |
| No passwords in responses | `select: false` on schema + `toSafeObject()` |

---

## 📡 API Endpoint Reference

All endpoints are prefixed with `/api/v1`.

### Auth  `POST /auth/signup`

Register a new student account.

**Request**
```json
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "Arjun Sharma",
  "email": "arjun@example.com",
  "password": "Study@2025",
  "targetExam": "NEET",
  "targetYear": 2026
}
```

**Response 201**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "user": {
      "_id": "664abc...",
      "name": "Arjun Sharma",
      "email": "arjun@example.com",
      "role": "user",
      "targetExam": "NEET",
      "targetYear": 2026,
      "createdAt": "2025-04-27T10:00:00.000Z"
    }
  }
}
```

---

### Auth  `POST /auth/login`

**Request**
```json
POST /api/v1/auth/login

{
  "email": "arjun@example.com",
  "password": "Study@2025"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "user": { ... }
  }
}
```

**Error 401**
```json
{ "success": false, "message": "Invalid email or password." }
```

---

### Auth  `POST /auth/google`

Exchange Google id_token (from `@react-oauth/google`) for a Vidhya JWT.

**Request**
```json
POST /api/v1/auth/google

{
  "credential": "<Google id_token from SDK>"
}
```

**Response 200** – same shape as login response.

---

### Auth  `GET /auth/me`  🔒

Returns the current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response 200**
```json
{
  "success": true,
  "message": "Profile fetched.",
  "data": { "_id": "...", "name": "...", "role": "user", ... }
}
```

---

### Users  `GET /users`  🔒 Admin only

Query params: `?page=1&limit=20&role=user&isActive=true&exam=NEET`

**Response 200**
```json
{
  "success": true,
  "data": [ {...}, {...} ],
  "meta": { "page": 1, "limit": 20, "total": 142, "totalPages": 8 }
}
```

---

### Users  `PATCH /users/:id`  🔒 Self only

Update name, targetExam, targetYear. Supports `multipart/form-data` with `avatar` file field.

**Request**
```json
PATCH /api/v1/users/664abc...

{
  "name": "Arjun S.",
  "targetExam": "JEE_MAINS"
}
```

---

### Users  `PATCH /users/:id/role`  🔒 Admin only

```json
PATCH /api/v1/users/664abc.../role

{ "role": "admin" }
```

---

### Flashcards  `GET /flashcards`  🔒

Query params: `?subject=Biology&difficulty=hard&page=1&limit=20&archived=false`

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "subject": "Biology",
      "chapter": "Cell Biology",
      "question": "What is the powerhouse of the cell?",
      "answer": "Mitochondria",
      "difficulty": "easy",
      "reviewCount": 3,
      "lastReviewed": "2025-04-26T..."
    }
  ],
  "meta": { "page": 1, "total": 84 }
}
```

---

### Flashcards  `POST /flashcards`  🔒

```json
POST /api/v1/flashcards

{
  "subject": "Chemistry",
  "chapter": "Organic Reactions",
  "deckTitle": "Organic Chemistry XII",
  "question": "What is Markovnikov's rule?",
  "answer": "In addition of HX to an alkene, H adds to the carbon with more hydrogens.",
  "difficulty": "medium"
}
```

---

### Flashcards  `PATCH /flashcards/:id/review`  🔒

Call after the student reviews a card. Updates `lastReviewed` and `reviewCount`.

```json
PATCH /api/v1/flashcards/664abc.../review

{ "difficulty": "easy" }
```

---

### Study Plans  `POST /study-plans`  🔒

```json
POST /api/v1/study-plans

{
  "weekLabel": "Week of Apr 28 – May 4",
  "sessions": [
    { "day": "Mon", "time": "9:00 AM", "title": "NEET Mock – Physics", "subject": "Physics", "durationMinutes": 90 },
    { "day": "Mon", "time": "6:00 PM", "title": "NCERT Biology – Genetics", "subject": "Biology", "durationMinutes": 60 }
  ]
}
```

---

### Study Plans  `PATCH /study-plans/:planId/sessions/:sessionId/complete`  🔒

Toggles a session's `isCompleted` flag and recalculates `adherencePct`.

---

### Progress  `GET /progress`  🔒

```json
{
  "success": true,
  "data": {
    "chapters": [
      { "chapterName": "Cell Biology", "subject": "Biology", "completionPct": 78 }
    ],
    "milestones": [
      { "icon": "🚀", "title": "Account Created", "achieved": true },
      { "icon": "🔥", "title": "7-Day Study Streak", "achieved": false }
    ],
    "currentStreak": 5,
    "longestStreak": 12,
    "totalStudyMinutes": 1240,
    "mockTestsAttempted": 3
  }
}
```

---

### Progress  `PATCH /progress/streak`  🔒

Call at the end of any study session.

```json
PATCH /api/v1/progress/streak

{
  "studyMinutes": 90,
  "flashcardsReviewed": 20,
  "mockTestCompleted": false
}
```

---

### Upload  `POST /upload/avatar`  🔒

Multipart form-data with field name `avatar` (JPEG / PNG / WEBP / GIF, max 5 MB).

**Response 200**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "/uploads/a1b2c3d4.jpg",
    "user": { ... }
  }
}
```

---

### Upload  `POST /upload/image`  🔒

For uploading question photos to send to the VIDYA AI. Field name: `image`.

**Response 200**
```json
{
  "success": true,
  "data": {
    "imageUrl": "/uploads/e5f6a7b8.jpg",
    "filename": "e5f6a7b8.jpg",
    "sizeBytes": 204832
  }
}
```

---

## 🏗️ Connecting the React Frontend

In your React app, set the API base URL:

```js
// src/config.js
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
```

Example login call:

```js
const res = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const { data } = await res.json();
localStorage.setItem('vidhya_token', data.token);
```

Add the token to all authenticated requests:

```js
headers: { 'Authorization': `Bearer ${localStorage.getItem('vidhya_token')}` }
```

---

## 🗒️ Error Response Format

All errors follow the same envelope:

```json
{
  "success": false,
  "message": "Human-readable description",
  "errors": [                        // optional – validation details
    { "field": "email", "message": "Please enter a valid email address." }
  ]
}
```

Common HTTP status codes used:

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad request / missing fields |
| 401 | Unauthenticated |
| 403 | Forbidden (wrong role) |
| 404 | Resource not found |
| 409 | Conflict (duplicate) |
| 422 | Validation failed |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
