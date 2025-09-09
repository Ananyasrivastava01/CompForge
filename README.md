# 🚀 CompForge - AI-Powered React Component Generator

CompForge is a modern web application that uses AI to generate React components with TypeScript and Tailwind CSS. Built with Next.js frontend and Node.js backend, it provides an intuitive interface for creating, customizing, and managing React components through natural language conversations.

## ✨ Features

### 🤖 AI-Powered Component Generation
- **Natural Language Input**: Describe components in plain English
- **TypeScript Support**: All generated components use TypeScript
- **Tailwind CSS**: Modern styling with utility classes
- **Responsive Design**: Components are mobile-friendly by default
- **Accessibility**: Components follow accessibility best practices

### 💬 Interactive Chat Interface
- **Real-time Chat**: Talk to AI to generate and modify components
- **Component Preview**: See your components render in real-time
- **Property Panel**: Modify component properties visually
- **Code Editor**: View and edit generated code directly

### 🔐 Authentication & Sessions
- **User Registration/Login**: Secure authentication system
- **OAuth Support**: Google and GitHub login options
- **Session Management**: Save and manage your component sessions
- **JWT Tokens**: Secure API authentication

### 📁 Project Management
- **Session Organization**: Create multiple component sessions
- **Version Control**: Track component changes and versions
- **Export Options**: Download components as ZIP files
- **Code Copy**: Easy code copying to clipboard

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Radix UI** - Accessible UI components
- **Lucide React** - Icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **OpenRouter API** - AI integration
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- OpenRouter API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd CompForge
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Environment Setup**

Create `.env` file in the `backend` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/compforge
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/compforge

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AI Service
OPENROUTER_API_KEY=your-openrouter-api-key-here

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000
```

4. **Start the application**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 🔧 Configuration

### MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/compforge`

**Option B: MongoDB Atlas (Recommended)**
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string and update `MONGODB_URI`

### OpenRouter API Setup
1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Get your API key
3. Add to `.env` file

### OAuth Setup (Optional)

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `http://localhost:5000/api/auth/google/callback`

**GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create OAuth App
3. Add callback URL: `http://localhost:5000/api/auth/github/callback`

## 🧪 Testing

Ad-hoc testing can be done with tools like Postman or curl. The repo no longer includes separate test scripts.

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/oauth/urls` - Get OAuth URLs

### Sessions
- `GET /api/sessions` - Get all user sessions
- `GET /api/sessions/:id` - Get single session
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session
- `POST /api/sessions/:id/chat` - Add chat message

### AI
- `POST /api/ai/generate` - Generate component
- `POST /api/ai/modify` - Modify component
- `POST /api/ai/chat` - Chat with AI

## 🎯 Usage Guide

### Creating Components
1. **Register/Login** to your account
2. **Create a new session** or use existing one
3. **Navigate to chat** page
4. **Describe your component** in natural language:
   - "Create a blue button with rounded corners"
   - "Make a responsive navigation bar"
   - "Generate a card component with image and text"

### Customizing Components
1. **Select elements** in the component preview
2. **Use the property panel** to modify styles
3. **Chat with AI** to make changes:
   - "Make this button red"
   - "Add padding to the card"
   - "Change the font size"

### Exporting Components
1. **View the generated code** in the code editor
2. **Copy code** to clipboard
3. **Download as ZIP** file with all files

## 🏗️ Project Structure

```
CompForge/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── package.json
├── frontend/               # Next.js React app
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   │   ├── page.tsx           # Home (Features section only)
│   │   │   ├── pricing/           # Pricing page
│   │   │   ├── api/               # API page
│   │   │   ├── about/             # About page
│   │   │   ├── blog/              # Blog page
│   │   │   ├── careers/           # Careers page
│   │   │   ├── help/              # Help Center page
│   │   │   ├── contact/           # Contact page
│   │   │   └── status/            # Status page
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities and API client
│   │   ├── store/         # Zustand state management
│   │   └── types/         # TypeScript types
│   └── package.json
└── README.md
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs for password security
- **CORS Protection** - Configured for production
- **Input Validation** - Request validation middleware
- **Error Handling** - Comprehensive error management

## 🚀 Deployment

Backend (Render) and Frontend (Vercel) quick deploy

Backend on Render (one-click):
- This repo includes `render.yaml`. In Render, choose New → Blueprint → Connect your GitHub repo → pick this repository. Render will detect `render.yaml` and provision a Web Service.
- Set the following environment variables in the Render dashboard (Service → Environment):
  - `NODE_ENV=production`
  - `BASE_URL=https://your-render-service.onrender.com` (after first deploy)
  - `MONGODB_URI=your MongoDB Atlas URI`
  - `JWT_SECRET=strong-random-string`
  - `OPENROUTER_API_KEY=your key`
  - `FRONTEND_URL=https://your-frontend-host`
  - `CORS_ORIGIN=https://your-frontend-host`
- Health check path: `/health` should return status OK when running.

Frontend on Vercel:
- Create a new Vercel project from the `frontend/` directory.
- Set Environment Variable: `NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com`
- Build command: `npm run build` (default)
- Start command: default (Vercel handles Next.js)
- After deploy, open the site and verify API requests go to the backend (check Network tab).

Notes
- Ensure `CORS_ORIGIN` and `FRONTEND_URL` match your exact frontend origin (including https).
- MongoDB: use MongoDB Atlas connection string.

---

## 🧭 Navigation overview

- Header: `Features` (in-page), `Pricing` (navigates to `/pricing`)
- Footer routes: `/pricing`, `/api`, `/about`, `/blog`, `/careers`, `/help`, `/contact`, `/status`
- Dashboard header now includes a `Home` button back to `/` and a `Back to Dashboard` button exists on all static pages

## 💬 Chat UX updates

- Code blocks are hidden inside chat bubbles; code is available in the right-side code panel
- Chat auto-scrolling is disabled; scrolling is manual

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure MongoDB is running
4. Check OpenRouter API key validity

## 🎉 Acknowledgments

- **OpenRouter** for AI capabilities
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **MongoDB** for the database solution

---

**Happy coding with CompForge! 🚀**