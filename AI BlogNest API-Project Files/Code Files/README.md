# AI BlogNest API

AI BlogNest API is a RESTful backend built with Node.js, Express, MongoDB, Mongoose, JWT authentication, bcrypt, and Gemini-powered AI content generation.

## Features

- User registration and login
- JWT-protected routes
- Blog creation, reading, updating, deleting
- AI blog content generation
- AI summarization
- MVC architecture

## Getting Started

1. Copy `.env.example` to `.env` and fill values
2. Install dependencies:

```bash
npm install
```

3. Start the app:

```bash
npm run dev
```

## Environment Variables

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

Example `.env` values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-blognest
JWT_SECRET=changeme_supersecret
GEMINI_API_KEY=sk-xxxxxxxxxxxxxxxx
GEMINI_MODEL=gemini-3.8
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Blogs
- `POST /api/blogs`
- `GET /api/blogs`
- `GET /api/blogs/:id`
- `PUT /api/blogs/:id`
- `DELETE /api/blogs/:id`

### AI
- `POST /api/ai/generate-blog`
- `POST /api/ai/summarize`

### Blog generation (drafts)
- `POST /api/blogs/generate` (protected) — generate a draft blog from topic and options

## Testing with Thunder Client

Use the above endpoints in Thunder Client or Postman with JSON body payloads.

Example requests

Register:

```
POST /api/auth/register
Content-Type: application/json

{
	"name": "Alice",
	"email": "alice@example.com",
	"password": "password123"
}
```

Login:

```
POST /api/auth/login
Content-Type: application/json

{
	"email": "alice@example.com",
	"password": "password123"
}
```

Generate draft (protected):

```
POST /api/blogs/generate
Authorization: Bearer <token>
Content-Type: application/json

{
	"topic": "Serverless architectures",
	"keywords": ["aws", "lambda", "cost"],
	"audience": "backend engineers",
	"tone": "informal",
	"language": "English",
	"length": "short"
}
```

Create blog manually (protected):

```
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
	"title": "My Post",
	"content": "This is the content",
	"category": "Technology"
}
```
