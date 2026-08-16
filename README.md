# AI Wardrobe Assistant

A production-ready AI-powered fashion recommendation system that helps users create perfect outfits from their existing wardrobe.

## 🎯 Product Overview

**The Problem:** Many users struggle to coordinate their wardrobe, unsure which clothing, jewelry, and footwear combinations suit specific events.

**The Solution:** AI Wardrobe Assistant uses natural language understanding combined with deterministic recommendation logic to suggest outfit combinations from a user's actual wardrobe items.

**Key Features (Planned):**
- 💬 Chat-based interface (WhatsApp/ChatGPT-style)
- 🖼️ Image-first recommendations (actual wardrobe photos)
- 🤖 AI-powered event understanding
- 🎯 Smart outfit compatibility checking
- 📊 Outfit ranking and diversity
- 🔄 Avoids recently worn combinations
- 🔐 Secure authentication and privacy

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│   React Frontend (Vite + TypeScript)        │
│   - Chat interface                          │
│   - Wardrobe management                     │
│   - Recommendation display                  │
└──────────────────┬──────────────────────────┘
                   │ HTTP/REST API
┌──────────────────┴──────────────────────────┐
│   Node.js Backend (Express + TypeScript)    │
│   - Authentication (JWT)                    │
│   - Recommendation engine                   │
│   - AI provider abstraction                 │
│   - Wardrobe management                     │
└──────────────────┬──────────────────────────┘
                   │
       ┌───────────┼───────────┐
       │           │           │
    MongoDB    Cloudinary    AI APIs
   (Database)  (Images)  (Gemini/Grok/Ollama)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image storage)
- AI API key (Gemini, Grok, or Ollama)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd AI_Wardrobe_Assisstant
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp ../.env.example ../.env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health: http://localhost:5000/api/health

## 📋 Development Phases

### Phase 1: ✅ Project Foundation (Current)
- [x] React frontend with Vite
- [x] Node.js/Express backend with TypeScript
- [x] MongoDB connection setup
- [x] Environment configuration
- [x] Folder structure
- [x] Basic API structure
- [x] Documentation

**Status:** Foundation complete. Ready for Phase 2.

### Phase 2: Authentication
- User registration
- User login
- JWT token handling
- Protected APIs

### Phase 3: Wardrobe Management
- CRUD operations
- Image upload to Cloudinary
- Metadata management
- Categories and filters

### Phase 4: Chat UI
- Chat interface design
- Message display
- Loading/error states

### Phase 5: AI Integration
- AI provider abstraction
- Gemini/Grok/Ollama support
- Event request parsing

### Phase 6: Recommendation Engine
- Candidate generation
- Compatibility checking
- Ranking algorithm
- Previous-use penalties

### Phase 7: Recommendation Display
- Image-first design
- Recommendation cards
- Reason explanations

### Phases 8-9: History & Deployment

## 📁 Project Structure

```
AI_Wardrobe_Assisstant/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts           # Environment configuration
│   │   │   └── database.ts      # MongoDB connection
│   │   ├── middleware/          # Express middleware
│   │   ├── models/              # Mongoose models (Phase 2+)
│   │   ├── controllers/         # Route handlers (Phase 2+)
│   │   ├── routes/              # API routes (Phase 2+)
│   │   ├── services/            # Business logic (Phase 2+)
│   │   ├── app.ts               # Express app setup
│   │   └── server.ts            # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── hooks/               # Custom React hooks
│   │   ├── context/             # React Context
│   │   ├── types/               # TypeScript types
│   │   ├── utils/               # Utility functions
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── AI.md
│   ├── SECURITY.md
│   └── DEPLOYMENT.md
│
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── DEVELOPMENT_CONTEXT.md       # Project state & decisions
└── README.md                    # This file
```

## 🔧 Technology Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- React Router
- CSS/Tailwind (to be added)

**Backend:**
- Node.js
- Express.js
- TypeScript
- Mongoose
- Zod (validation)
- JWT
- bcryptjs

**Database:**
- MongoDB

**Services:**
- Cloudinary (image storage)
- Gemini/Grok/Ollama (AI)

## 📚 Documentation

- [DEVELOPMENT_CONTEXT.md](./DEVELOPMENT_CONTEXT.md) - Project state, decisions, and architecture
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Detailed architecture
- [docs/DATABASE.md](./docs/DATABASE.md) - Database schema and setup
- [docs/AI.md](./docs/AI.md) - AI provider abstraction
- [docs/SECURITY.md](./docs/SECURITY.md) - Security considerations

## 🧪 Testing Phase 1

### Backend
```bash
cd backend
npm install
npm run typecheck    # TypeScript compilation check
npm run dev         # Start development server
```

Expected output:
```
============================================================
✓ AI Wardrobe Assistant Backend Started
============================================================
Environment: development
Server URL: http://localhost:5000
API Health: http://localhost:5000/api/health
============================================================
```

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### Frontend
```bash
cd frontend
npm install
npm run dev         # Start development server
```

Browser will open automatically at http://localhost:5173

## 🔐 Security Notes

- Never commit `.env` file
- Never expose API keys to frontend
- Passwords are hashed (bcryptjs) on backend
- JWT tokens for authentication
- All user data is isolated per user ID
- Input validation with Zod

## 🌍 Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Backend
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-wardrobe-assistant
JWT_SECRET=your-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI Provider
AI_PROVIDER=gemini
GEMINI_API_KEY=your-api-key
```

## 📝 Important Principles

1. **Hybrid AI + Deterministic:** AI understands user input; backend owns recommendation logic
2. **User Privacy:** Users can only access their own data
3. **Image-First:** Recommendations show actual wardrobe photos
4. **Provider Agnostic:** Can switch AI providers (Gemini, Grok, Ollama)
5. **No AI Hallucinations:** Backend validates all AI output
6. **Production Quality:** Well-tested, documented, and secure
7. **Modular Design:** Easy to extend and maintain

## 🤝 Contributing

This project follows strict architectural principles. When making changes:

1. Read DEVELOPMENT_CONTEXT.md
2. Understand the current implementation
3. Make minimal, targeted changes
4. Update documentation
5. Maintain TypeScript strict mode

## 📄 License

MIT

## 📞 Support

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for deployment instructions.

---

**Current Phase:** 1 - Project Foundation ✅  
**Next Phase:** 2 - Authentication
