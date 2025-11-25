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

## Setup

### 1. Create an Upstash Redis Database

1. Go to [Upstash Console](https://console.upstash.com)
2. Create a new Redis database (free tier is sufficient)
3. Copy the **REST URL** and **REST Token** from the database details

### 2. Configure Environment Variables

Create a `.env` file in the `packages/backend` directory:

```bash
cd packages/backend
cp .env.example .env  # Or create manually
```

Edit the `.env` file:

```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
PORT=3001
```

### 3. Install Dependencies

From the project root:

```bash
npm install
```

### 4. Run Development Servers

Start both frontend and backend:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

### POST `/api/{queue_name}`

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

### GET `/api/{queue_name}?timeout={ms}`

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

## Deployment

### Deploy Backend to Railway/Render

1. Create a new project on [Railway](https://railway.app) or [Render](https://render.com)
2. Connect your GitHub repository
3. Set the build command: `npm install && npm run build`
4. Set the start command: `npm run start`
5. Set root directory to `packages/backend`
6. Add environment variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Deploy Frontend to Vercel/Netlify

1. Create a new project on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Set the build command: `npm run build`
4. Set the output directory: `dist`
5. Set root directory to `packages/frontend`
6. Add environment variable for API URL (create `packages/frontend/.env.production`):
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```

For production, update `packages/frontend/src/api.ts` to use the environment variable:

```typescript
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```

## Project Structure

```
message-queue/
├── packages/
│   ├── shared/           # Shared TypeScript types
│   │   └── src/
│   │       └── index.ts  # Type definitions
│   ├── backend/          # Express API server
│   │   └── src/
│   │       ├── index.ts  # Express server
│   │       └── queue.ts  # Redis queue operations
│   └── frontend/         # React application
│       └── src/
│           ├── App.tsx
│           ├── api.ts
│           └── components/
├── package.json          # Root workspace config
└── README.md
```

## License

MIT

