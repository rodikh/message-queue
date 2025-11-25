# Message Queue

A real-time message queue application with a React frontend and Express backend, using Upstash Redis for message storage.

## Features

- **Producer**: Send JSON messages to named queues
- **Consumer**: Retrieve messages with long-polling support
- **Real-time**: Messages are delivered as soon as they're available
- **Multiple Queues**: Create and use any number of named queues

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express, TypeScript
- **Queue Storage**: Upstash Redis (free tier available)
- **Styling**: Custom CSS with modern design

## Prerequisites

- Node.js 18+ and npm
- An [Upstash](https://upstash.com) account (free tier available)

## Local Development

### 1. Create an Upstash Redis Database

1. Go to [Upstash Console](https://console.upstash.com)
2. Create a new Redis database (free tier is sufficient)
3. Copy the **REST URL** and **REST Token** from the database details

### 2. Configure Environment Variables

Create a `.env` file in the `packages/backend` directory:

```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
PORT=3001
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Servers

```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

### POST `/api/queue/{queue_name}`

Add a message to the queue.

**Request Body:**
```json
{
  "data": {
    "your": "json",
    "data": "here"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": {
    "id": "uuid",
    "data": { ... },
    "timestamp": 1234567890,
    "queueName": "queue_name"
  }
}
```

### GET `/api/queue/{queue_name}?timeout={ms}`

Retrieve and remove the next message from the queue.

**Parameters:**
- `timeout` (optional): Long-polling timeout in milliseconds (default: 10000)

**Response (200):**
```json
{
  "success": true,
  "message": {
    "id": "uuid",
    "data": { ... },
    "timestamp": 1234567890,
    "queueName": "queue_name"
  }
}
```

**Response (204):** No content - queue is empty after timeout

---

## Deployment to Railway (Recommended)

Railway offers a generous free tier and serves both frontend and backend from the same domain.

### Step 1: Push to GitHub

Make sure your code is pushed to a GitHub repository.

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `message-queue` repository
4. Railway will auto-detect the configuration from `railway.json`

### Step 3: Add Environment Variables

In your Railway project dashboard:

1. Click on your service
2. Go to **"Variables"** tab
3. Add the following variables:

```
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
NODE_ENV=production
```

### Step 4: Deploy

Railway will automatically build and deploy. Your app will be available at:
- `https://your-project.up.railway.app`

The frontend and API are served from the same domain - no CORS issues!

### Alternative: Render

1. Go to [render.com](https://render.com) and create a new **Web Service**
2. Connect your GitHub repository
3. Set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. Add the environment variables (same as Railway)

---

## Project Structure

```
message-queue/
├── packages/
│   ├── shared/              # Shared TypeScript types
│   │   └── src/index.ts
│   ├── backend/             # Express API server
│   │   └── src/
│   │       ├── index.ts     # Server & static file serving
│   │       ├── routers/
│   │       │   └── queue.ts # Queue API routes
│   │       └── services/
│   │           └── queue.ts # Redis queue operations
│   └── frontend/            # React application
│       └── src/
│           ├── App.tsx
│           ├── api.ts
│           └── components/
├── package.json             # Monorepo workspace config
├── railway.json             # Railway deployment config
├── nixpacks.toml            # Build configuration
└── README.md
```

## License

MIT
