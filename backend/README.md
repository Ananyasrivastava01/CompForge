# CompForge Backend

AI-driven React component generator backend API.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- OpenRouter API key

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Start the server:**
```bash
# Development
npm run dev

# Production
npm start
```

## 📋 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/compforge

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AI Service
OPENROUTER_API_KEY=your-openrouter-api-key-here

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 🔐 OAuth Setup (Optional)

To enable OAuth authentication:

1. **Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`

2. **GitHub OAuth:**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create a new OAuth App
   - Add callback URL: `http://localhost:5000/api/auth/github/callback`

## 🧪 Testing

Run the test script to verify all endpoints:

```bash
node test-api.js
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/oauth/urls` - Get OAuth URLs
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/github/callback` - GitHub OAuth callback

### Sessions
- `GET /api/sessions` - Get all user sessions (protected)
- `GET /api/sessions/:id` - Get single session (protected)
- `POST /api/sessions` - Create new session (protected)
- `PUT /api/sessions/:id` - Update session (protected)
- `DELETE /api/sessions/:id` - Delete session (protected)
- `POST /api/sessions/:id/chat` - Add chat message (protected)

### AI
- `POST /api/ai/generate` - Generate component (protected)
- `POST /api/ai/modify` - Modify component (protected)
- `POST /api/ai/chat` - Chat with AI (protected)

## 🔧 Project Structure

```
src/
├── app.js                 # Main Express app
├── controllers/           # Route controllers
│   ├── authController.js
│   ├── sessionController.js
│   └── aiController.js
├── middleware/            # Express middleware
│   └── auth.js
├── models/               # MongoDB models
│   ├── User.js
│   └── Session.js
├── routes/               # API routes
│   ├── auth.js
│   ├── sessions.js
│   ├── components.js
│   └── ai.js
├── services/             # Business logic
│   └── aiService.js
└── utils/                # Utility functions
    └── database.js
```

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🤖 AI Integration

The backend integrates with OpenRouter API for component generation. Make sure to:

1. Get an API key from [OpenRouter](https://openrouter.ai)
2. Add it to your `.env` file
3. The AI service supports both regular and streaming responses

## 📊 Database Schema

### User
- `email` (String, unique)
- `password` (String, hashed)
- `name` (String)
- `createdAt`, `updatedAt` (Timestamps)

### Session
- `userId` (ObjectId, ref: User)
- `name` (String)
- `description` (String, optional)
- `currentComponent` (Object)
  - `jsxCode` (String)
  - `cssCode` (String)
  - `metadata` (Object)
  - `version` (Number)
- `chatHistory` (Array of messages)
- `createdAt`, `updatedAt` (Timestamps)

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Setup
- Use MongoDB Atlas for production database
- Set `NODE_ENV=production`
- Use a strong JWT secret
- Configure CORS for your frontend domain 