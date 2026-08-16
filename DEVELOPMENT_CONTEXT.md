# DEVELOPMENT_CONTEXT.md

**This document is the source of truth for the project state. Update it after each phase.**

## 📌 Project Overview

**Name:** AI Wardrobe Assistant

**Purpose:** Help users decide what to wear for events by analyzing their existing wardrobe and suggesting outfit combinations using AI.

**Current Phase:** 1 - Project Foundation ✅

**Status:** Phase 1 complete. Foundation established. Ready for Phase 2 (Authentication).

---

## 🎯 Core Architectural Principles

1. **Hybrid AI + Deterministic:** 
   - AI is responsible for: understanding natural language, extracting event info, explaining recommendations
   - Backend is responsible for: wardrobe queries, candidate generation, compatibility checking, ranking
   - Recommendation engine works independently of AI provider

2. **User Privacy & Authorization:**
   - Every query uses authenticated user ID from JWT
   - Users can only access their own wardrobe, recommendations, history
   - User IDs are NEVER trusted from frontend

3. **Image-First Design:**
   - Every recommendation MUST show actual wardrobe item images
   - Never invent or fabricate wardrobe items
   - Recommendations display Cloudinary URLs

4. **Provider Agnostic:**
   - AI provider (Gemini, Grok, Ollama) is configurable
   - Backend imports AI providers through abstraction layer
   - Switching providers requires no business logic changes

5. **No Over-Engineering:**
   - RAG/vector search NOT in V1
   - Virtual try-on NOT in V1
   - Weather/calendar integration NOT in V1
   - Start simple, extend later

---

## 🏗️ Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Router:** React Router v6
- **HTTP Client:** Axios
- **State Management:** React Context (no Redux)
- **Styling:** CSS (Tailwind to be added in later phase)

### Backend
- **Runtime:** Node.js (18+)
- **Framework:** Express.js
- **Language:** TypeScript (strict mode)
- **Database:** MongoDB with Mongoose ODM
- **Validation:** Zod
- **Authentication:** JWT + bcryptjs
- **File Upload:** Cloudinary SDK
- **Security:** helmet, cors

### Database
- **Primary:** MongoDB (local or Atlas)
- **GUI:** MongoDB Compass (for inspection)

### External Services
- **Image Storage:** Cloudinary
- **AI Providers:** Gemini, Grok, Ollama

---

## 📁 Folder Structure (Phase 1)

```
AI_Wardrobe_Assisstant/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts              # Environment variables
│   │   │   └── database.ts         # MongoDB connection
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts   # JWT middleware (Phase 2)
│   │   ├── app.ts                  # Express app
│   │   └── server.ts               # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── dist/                       # Compiled output
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 # Main component
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Base styles
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── dist/                       # Build output
│
├── docs/                           # Documentation (to be added)
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── AI.md
│   ├── SECURITY.md
│   └── DEPLOYMENT.md
│
├── .env.example                    # Environment template
├── .gitignore
├── README.md                       # Main documentation
└── DEVELOPMENT_CONTEXT.md          # This file
```

---

## 📊 Data Models (Planned)

### Phase 1 Status
Data models are NOT implemented in Phase 1. This is Phase 2+ work.

### USER (Phase 2)
```typescript
{
  _id: ObjectId,
  username: string,
  passwordHash: string,
  preferences: {
    preferredStyles: string[],
    preferredColors: string[],
    dislikedColors: string[],
    preferredFormality: number | null,
  },
  createdAt: Date,
  updatedAt: Date,
}
```

### WARDROBE_ITEM (Phase 3)
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  category: 'frock' | 'top' | 'shirt' | 'pant' | 'earring' | ...,
  subCategory: string,
  name: string,
  colors: string[],
  material: string,
  pattern: string,
  styleTags: string[],
  occasionTags: string[],
  formality: number (1-5),
  seasonTags: string[],
  image: {
    url: string,
    publicId: string,
    width: number,
    height: number,
  },
  active: boolean,
  createdAt: Date,
  updatedAt: Date,
}
```

### RECOMMENDATION_HISTORY (Phase 7+)
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  eventRequest: string,
  itemIds: ObjectId[],
  score: number,
  shownAt: Date,
  selectedByUser: boolean,
  wornByUser: boolean,
}
```

---

## 🔌 API Endpoints (Planned)

All endpoints are NOT implemented in Phase 1.

### Authentication (Phase 2)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Wardrobe (Phase 3)
- `GET /api/wardrobe` - List user's wardrobe
- `POST /api/wardrobe` - Create wardrobe item
- `GET /api/wardrobe/:id` - Get item details
- `PATCH /api/wardrobe/:id` - Update item
- `DELETE /api/wardrobe/:id` - Delete item

### Upload (Phase 3)
- `POST /api/uploads/image` - Upload image to Cloudinary

### Recommendations (Phase 6)
- `POST /api/chat` - Send message, get recommendations
- `GET /api/recommendations/history` - Get history
- `GET /api/recommendations/:id` - Get specific recommendation
- `POST /api/recommendations/:id/worn` - Mark as worn

### Profile (Phase 8)
- `GET /api/profile` - Get user profile
- `PATCH /api/profile/preferences` - Update preferences

---

## 🚀 Environment Configuration

Located in `.env.example`. Key variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-wardrobe-assistant
JWT_SECRET=your-secret-key-change-in-production
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
AI_PROVIDER=gemini
GEMINI_API_KEY=
GROK_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434
```

---

## 🔐 Security Implementation (Phase 1 Status)

### Phase 1: Foundation (Current)
- [x] TypeScript strict mode
- [x] Environment variables for secrets
- [x] .gitignore configured
- [x] No secrets in codebase

### Phase 2+: Authentication
- [ ] bcryptjs password hashing
- [ ] JWT token generation
- [ ] JWT verification middleware
- [ ] Password validation rules

### Phase 3+: Authorization
- [ ] User ID from JWT (never from frontend)
- [ ] Query filtering by userId
- [ ] Cross-user data protection

### Ongoing
- [ ] Zod input validation
- [ ] MIME type validation for uploads
- [ ] File size limits (5MB images)
- [ ] Error handling (no stack traces in production)

---

## 🤖 AI Provider Architecture (Phase 5+)

### Phase 1 Status
Not implemented. This is Phase 5 work.

### Design
```
Controller → RecommendationService → AIService → AIProvider → Gemini/Grok/Ollama
```

### Providers
- GeminiProvider
- GrokProvider
- OllamaProvider

### Responsibilities
- Parse natural language event requests
- Extract structured event information
- Validate with Zod
- Explain recommendations (optional)

### NOT Responsible For
- Choosing wardrobe items (backend does this)
- Ranking outfits (deterministic engine does this)
- Modifying recommendation items

---

## 🎯 Recommendation Engine (Phase 6+)

### Phase 1 Status
Not implemented. This is Phase 6 work.

### Architecture
1. **CandidateGenerator** - Filter and generate outfit candidates
2. **CompatibilityChecker** - Verify outfit structure
3. **RankingEngine** - Score outfits based on:
   - Event compatibility (30%)
   - Color harmony (20%)
   - Style consistency (15%)
   - Formality match (15%)
   - User preferences (10%)
   - Item quality (5%)
   - Novelty/recency (5%)
4. **DiversityService** - Ensure top recommendations differ

### Ranking Configuration
Located in `ranking.config.ts` (Phase 6). Weights must be centralized, not scattered.

### Previous-Use Penalty
- New combination: +10
- Used 90+ days ago: +3
- Used 30-90 days ago: 0
- Used 7-30 days ago: -10
- Used 7 days ago: -25
- Exact repeat: additional -15

---

## 📚 Documentation Files (Phase 1 Status)

| File | Status | Purpose |
|------|--------|---------|
| README.md | ✅ Complete | Project overview, quick start, principles |
| DEVELOPMENT_CONTEXT.md | ✅ Complete | This file - source of truth |
| docs/ARCHITECTURE.md | ⏳ Phase 2 | Detailed system architecture |
| docs/DATABASE.md | ⏳ Phase 2 | Database schema, MongoDB Compass setup |
| docs/AI.md | ⏳ Phase 5 | AI provider abstraction details |
| docs/RANKING_ENGINE.md | ⏳ Phase 6 | Ranking algorithm documentation |
| docs/SECURITY.md | ⏳ Phase 2 | Security implementation details |
| docs/DEPLOYMENT.md | ⏳ Phase 9 | Deployment guide |
| docs/DEVELOPMENT_GUIDE.md | ⏳ Phase 2 | Development workflow |
| docs/FUTURE_FEATURES.md | ✅ Complete | Future features (not implemented) |

---

## ✅ Phase 1 Completion Checklist

- [x] React frontend structure (Vite + TypeScript)
- [x] Node.js/Express backend structure
- [x] TypeScript configuration (strict mode)
- [x] MongoDB connection infrastructure
- [x] Environment configuration
- [x] .env.example template
- [x] .gitignore
- [x] Folder structure
- [x] Basic API endpoints (health check)
- [x] README.md
- [x] DEVELOPMENT_CONTEXT.md
- [x] Base documentation structure
- [x] Git repository initialized

---

## 🔄 Phase 2: Authentication (Next)

### Planned Work
- User registration with validation
- User login with JWT
- Password hashing (bcryptjs)
- Protected API middleware
- JWT token refresh
- User model in MongoDB

### Key Files to Create
- `backend/src/models/User.ts`
- `backend/src/controllers/authController.ts`
- `backend/src/routes/authRoutes.ts`
- `backend/src/services/auth/AuthService.ts`
- `backend/src/schemas/authSchemas.ts`
- `frontend/src/pages/LoginPage.tsx`
- `frontend/src/pages/RegisterPage.tsx`
- `frontend/src/context/AuthContext.tsx`
- `frontend/src/services/api/authApi.ts`

---

## 🚨 Known Limitations

### Phase 1
- No user authentication
- No database models
- No API routes
- Frontend has only placeholder content
- Backend has only health check endpoint

### By Design (Not Bugs)
- RAG/vector search not implemented (Phase 2+)
- Virtual try-on not implemented (Phase 2+)
- Weather integration not implemented (Phase 2+)
- Calendar integration not implemented (Phase 2+)
- Personalization learning not implemented (Phase 2+)

---

## 📋 Important Architectural Decisions

1. **No Redux:** Using React Context initially. TanStack Query can be added if needed.
2. **TypeScript Strict Mode:** Enforced throughout to prevent type errors.
3. **Zod for Validation:** Type-safe validation at runtime (backend input validation).
4. **JWT for Auth:** Stateless authentication, easier to scale.
5. **MongoDB + Mongoose:** Flexible schema, good for iterative development.
6. **Cloudinary for Images:** Avoid storing binaries in MongoDB, use managed service.
7. **Provider Abstraction:** Critical for AI switching without code changes.
8. **Deterministic Ranking:** Not ML-based in V1 to keep system transparent and controllable.

---

## 🔍 Testing Strategy (Phase 1)

### Backend
```bash
cd backend
npm install
npm run typecheck    # Check TypeScript
npm run dev         # Start dev server
curl http://localhost:5000/api/health
```

### Frontend
```bash
cd frontend
npm install
npm run dev         # Start dev server (auto-opens browser)
```

### Full Stack
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- API proxy via Vite dev server

---

## 📝 Version History

### v0.1.0 (Phase 1)
- Project foundation
- Folder structure
- Build configuration
- Basic documentation

---

## 🔗 Important Files to Know

| File | Purpose | Modify When |
|------|---------|-------------|
| `.env.example` | Configuration template | Adding new environment variables |
| `backend/package.json` | Backend dependencies | Adding libraries |
| `frontend/package.json` | Frontend dependencies | Adding libraries |
| `backend/tsconfig.json` | TypeScript config | Changing compilation rules |
| `backend/src/config/env.ts` | Environment management | Adding new config variables |
| `backend/src/app.ts` | Express app setup | Adding middleware or global settings |
| `README.md` | User documentation | Major feature changes |
| `DEVELOPMENT_CONTEXT.md` | Developer documentation | **ALWAYS update after each phase** |

---

## ⚠️ Critical Reminders

1. **Never commit `.env`** - Always use `.env.example`
2. **Never expose API keys to frontend** - Keep secrets server-side
3. **Never trust user IDs from frontend** - Always use JWT authenticated ID
4. **Never invent wardrobe items** - Only work with actual user items
5. **Always update DEVELOPMENT_CONTEXT.md** after each phase
6. **Keep TypeScript strict mode** - No `any` types
7. **Keep code modular** - Business logic separate from UI
8. **Always validate AI output** - Treat it as untrusted input

---

## 📞 Support & Resources

- **MongoDB Setup:** docs/DATABASE.md (to be created)
- **AI Integration:** docs/AI.md (to be created)
- **Deployment:** docs/DEPLOYMENT.md (to be created)
- **Security:** docs/SECURITY.md (to be created)

---

**Last Updated:** Phase 1 Completion  
**Next Review:** Phase 2 Completion
