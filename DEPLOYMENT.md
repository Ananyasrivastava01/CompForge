# 🚀 CompForge Deployment Guide

## 📋 Prerequisites

1. **GitHub Repository** - Your code should be pushed to GitHub
2. **MongoDB Atlas** - Cloud database (free tier available)
3. **OpenRouter API Key** - For AI functionality
4. **Vercel Account** - For frontend deployment
5. **Railway Account** - For backend deployment

## 🔧 Backend Deployment (Railway)

### Step 1: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select your repository**
5. **Set Root Directory** to `backend`
6. **Configure Environment Variables:**

```env
NODE_ENV=production
PORT=5000
BASE_URL=https://your-backend-url.railway.app

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/compforge

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-for-production

# OpenRouter API Key
OPENROUTER_API_KEY=your-openrouter-api-key

# Frontend URL (will be updated after frontend deployment)
FRONTEND_URL=https://your-frontend-url.vercel.app

# CORS Origin
CORS_ORIGIN=https://your-frontend-url.vercel.app

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

7. **Deploy** - Railway will automatically build and deploy
8. **Get your backend URL** (e.g., `https://compforge-backend.railway.app`)

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Import Project** → Select your repository
4. **Configure Project Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

5. **Add Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

6. **Deploy** - Vercel will build and deploy your frontend
7. **Get your frontend URL** (e.g., `https://compforge.vercel.app`)

### Step 2: Update Backend CORS

After getting your frontend URL, update the backend environment variables:

1. **Go back to Railway dashboard**
2. **Update environment variables:**
```env
FRONTEND_URL=https://your-frontend-url.vercel.app
CORS_ORIGIN=https://your-frontend-url.vercel.app
```
3. **Redeploy** the backend

## 🔐 OAuth Configuration (Optional)

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-backend-url.railway.app/api/auth/google/callback`

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create OAuth App
3. Add callback URL: `https://your-backend-url.railway.app/api/auth/github/callback`

## 🧪 Testing Deployment

### Backend Health Check
```bash
curl https://your-backend-url.railway.app/health
```

### Frontend Test
1. Visit your frontend URL
2. Register a new account
3. Create a session
4. Test AI component generation

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` matches your frontend URL exactly
   - Check for trailing slashes

2. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas

3. **AI Not Working**
   - Verify OpenRouter API key is valid
   - Check API key has sufficient credits

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

## 📊 Monitoring

### Railway Dashboard
- Monitor backend logs
- Check resource usage
- View deployment status

### Vercel Dashboard
- Monitor frontend performance
- Check build logs
- View analytics

## 🔄 Updates

### Backend Updates
1. Push changes to GitHub
2. Railway automatically redeploys
3. Check logs for any issues

### Frontend Updates
1. Push changes to GitHub
2. Vercel automatically redeploys
3. Check build status

## 🎉 Success!

Your CompForge application is now live and accessible to everyone!

- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.railway.app
- **Health Check:** https://your-backend.railway.app/health

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [OpenRouter](https://openrouter.ai)

---

**Happy deploying! 🚀** 