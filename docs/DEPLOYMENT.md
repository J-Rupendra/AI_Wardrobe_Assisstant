# DEPLOYMENT.md

**Production deployment guide.**

## 📚 Table of Contents

- [Deployment Overview](#deployment-overview)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Setup](#environment-setup)
- [Deployment Platforms](#deployment-platforms)
- [Monitoring](#monitoring)
- [Rollback](#rollback)

---

## Deployment Overview

### Phase 1 Status

Deployment is Phase 9 work. This document outlines the plan.

### Deployment Strategy

**Development:**
- Local MongoDB
- Local Ollama or free Gemini tier
- Vite dev server
- Express dev server

**Production:**
- MongoDB Atlas
- Gemini API (paid tier) or Grok
- Static hosting (Vercel, Netlify)
- Backend hosting (Heroku, Railway, Render)

---

## Pre-Deployment Checklist

### Code Quality (Phases 1-6)
- [ ] All TypeScript checks pass (`npm run typecheck`)
- [ ] All tests pass (`npm run test`)
- [ ] ESLint passes (`npm run lint`)
- [ ] No console.logs (except logging)
- [ ] No TODO comments

### Security (Phases 1-6)
- [ ] No .env file committed
- [ ] No hardcoded secrets
- [ ] All passwords hashed
- [ ] JWT secrets strong
- [ ] API keys only server-side
- [ ] HTTPS configured

### Configuration (Phases 1-6)
- [ ] Production .env created
- [ ] DATABASE_URL points to production
- [ ] Node version specified
- [ ] All dependencies locked
- [ ] Build process tested locally

### Documentation (Phases 1-6)
- [ ] README updated
- [ ] DEVELOPMENT_CONTEXT updated
- [ ] All docs current
- [ ] Deployment instructions clear

---

## Environment Setup

### Backend Environment Variables

```bash
# Production .env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com

# Database
MONGODB_URI=mongodb+srv://prod_user:STRONG_PASSWORD@cluster.mongodb.net/ai-wardrobe-assistant

# JWT
JWT_SECRET=LONG_RANDOM_STRING_AT_LEAST_32_CHARS

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI
AI_PROVIDER=gemini
GEMINI_API_KEY=your-production-key
```

### Generate Strong Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate admin password
openssl rand -base64 32
```

---

## Deployment Platforms

### Option 1: Vercel (Recommended for Frontend)

**Frontend Deployment:**

1. Push code to GitHub
2. Connect GitHub to Vercel
3. Set build command: `npm run build`
4. Set output: `dist`
5. Deploy

**Environment variables:**
```
VITE_API_URL=https://api.yourdomain.com
```

### Option 2: Netlify (Alternative Frontend)

Similar to Vercel, also supports SPA.

### Option 3: Railway (Recommended for Backend)

**Backend Deployment:**

1. Push code to GitHub
2. Connect GitHub to Railway
3. Create PostgreSQL or MongoDB database
4. Set environment variables
5. Deploy

**Build command:** `npm run build`  
**Start command:** `npm start`

### Option 4: Heroku (Alternative Backend)

1. Install Heroku CLI
2. Create app: `heroku create app-name`
3. Add MongoDB Atlas: `heroku addons:create mongolab:sandbox`
4. Set environment variables: `heroku config:set JWT_SECRET=...`
5. Push code: `git push heroku main`

### Option 5: Self-Hosted (Advanced)

Requirements:
- Linux server (Ubuntu 22.04+)
- Node.js 18+
- MongoDB
- Nginx (reverse proxy)
- SSL certificate (Let's Encrypt)

---

## Monitoring

### Application Monitoring

- Error tracking: Sentry
- Performance: Datadog, New Relic
- Logs: Vercel/Railway logs, CloudWatch

### Database Monitoring

- MongoDB Atlas: Built-in monitoring
- Alerts: Set up on slow queries, disk usage

### API Monitoring

- Uptime: UptimeRobot, StatusPage
- Performance: API response times

---

## Rollback

### Quick Rollback

1. Identify problematic version
2. Redeploy previous commit
3. Verify health endpoints

### Database Rollback

1. MongoDB Atlas has backups
2. Request point-in-time restore
3. Test before production

---

**Document Status:** Phase 1 - Outline, Phase 9 implementation  
**Implementation Phase:** Phase 9
