# ARCHITECTURE.md

**Detailed system architecture documentation for AI Wardrobe Assistant.**

## 📚 Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Layered Architecture](#layered-architecture)
- [Data Flow](#data-flow)
- [Component Design](#component-design)
- [Key Design Patterns](#key-design-patterns)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                      │
│          (Vite + TypeScript + React Router)            │
│  - Chat interface                                       │
│  - Wardrobe management                                  │
│  - Recommendation display                               │
└──────────────────────┬──────────────────────────────────┘
                       │
                 REST API / HTTP
                       │
┌──────────────────────┴──────────────────────────────────┐
│            Node.js/Express Backend                      │
│              (TypeScript + MongoDB)                     │
│  - Authentication & Authorization                       │
│  - API Route Handlers                                   │
│  - Business Logic Services                              │
│  - AI Provider Abstraction                              │
│  - Recommendation Engine                                │
└──────────────────────┬──────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
    MongoDB       Cloudinary        AI APIs
   (Database)     (Images)      (Gemini/Grok)
```

---

## Technology Stack

### Frontend (React)

```
src/
├── components/              # Reusable UI components
│   ├── chat/               # Chat interface
│   ├── recommendations/    # Recommendation display
│   ├── wardrobe/          # Wardrobe management
│   ├── auth/              # Login/Register forms
│   └── common/            # Shared components
├── pages/                 # Page-level components
├── services/              # API communication
├── hooks/                 # Custom React hooks
├── context/               # React Context
├── types/                 # TypeScript interfaces
└── utils/                 # Utility functions
```

**Key Technologies:**
- React 18 (component framework)
- TypeScript (type safety)
- Vite (build tool, dev server)
- React Router (page navigation)
- Axios (HTTP client)
- Context API (state management)

### Backend (Node.js)

```
backend/src/
├── config/                # Configuration
│   ├── env.ts            # Environment variables
│   └── database.ts       # Database connection
├── models/               # Mongoose schemas
├── controllers/          # Request handlers
├── routes/              # API endpoints
├── services/            # Business logic
│   ├── auth/
│   ├── wardrobe/
│   ├── recommendation/
│   ├── ranking/
│   ├── ai/
│   └── cloudinary/
├── middleware/          # Express middleware
├── schemas/            # Zod validation
├── utils/             # Helper functions
├── app.ts             # Express setup
└── server.ts          # Server entry point
```

**Key Technologies:**
- Express.js (HTTP server)
- TypeScript (type safety)
- Mongoose (MongoDB ODM)
- Zod (input validation)
- JWT (authentication)
- bcryptjs (password hashing)

---

## Layered Architecture

### Request Flow

```
User Input (Frontend)
    ↓
React Component
    ↓
API Service (Axios)
    ↓
HTTP Request to Backend
    ↓
Express Middleware (CORS, Auth, Validation)
    ↓
Route Handler (Controller)
    ↓
Service Layer (Business Logic)
    ↓
Database Layer (Mongoose Models)
    ↓
MongoDB / External Services
    ↓
Response JSON
    ↓
Frontend State Update
    ↓
UI Re-render
```

### Layer Responsibilities

#### Presentation Layer (Frontend)
- **Responsibility:** Display UI, capture user input
- **Technology:** React components
- **Does NOT:** Contain business logic, ranking, database queries

#### API Service Layer
- **Responsibility:** Communicate with backend via HTTP
- **Technology:** Axios service modules
- **Does NOT:** Handle data transformation, validation

#### Controller Layer (Backend)
- **Responsibility:** Parse requests, delegate to services, format responses
- **Technology:** Express route handlers
- **Does NOT:** Contain business logic (that's services' job)
- **Pattern:** Thin controllers

#### Service Layer (Backend)
- **Responsibility:** Implement business logic, coordinate between components
- **Technology:** TypeScript classes/functions
- **Components:**
  - AuthService (user authentication)
  - WardrobeService (wardrobe management)
  - RecommendationService (orchestrate recommendations)
  - RankingEngine (score outfits)
  - AIService (AI provider coordination)
  - CloudinaryService (image management)

#### Model Layer (Backend)
- **Responsibility:** Database schema definition, persistence
- **Technology:** Mongoose schemas
- **Models:** User, WardrobeItem, RecommendationHistory

#### Data Layer (Backend)
- **Responsibility:** Data persistence
- **Technology:** MongoDB
- **Never:** Store business logic here

---

## Data Flow

### User Authentication Flow

```
Frontend
  ↓
[LoginForm collects username + password]
  ↓
authApi.login(username, password)
  ↓
POST /api/auth/login
  ↓
Backend Controller
  ↓
AuthService.login()
  ↓
Find user in MongoDB
  ↓
Verify password with bcryptjs
  ↓
Generate JWT token
  ↓
Return token to frontend
  ↓
Frontend stores token
  ↓
All subsequent requests include JWT in header
```

### Recommendation Request Flow

```
Frontend
  ↓
[User types event description]
  ↓
recommendationApi.chat(message)
  ↓
POST /api/chat (with JWT)
  ↓
Backend
  ↓
Extract user ID from JWT
  ↓
AIService → parseEventRequest(message)
  ↓
AI Provider extracts event info
  ↓
RecommendationService.generateRecommendations()
  ↓
CandidateGenerator filters wardrobe
  ↓
RankingEngine scores candidates
  ↓
DiversityService filters duplicates
  ↓
Return top recommendations with images
  ↓
Frontend displays recommendation cards
```

---

## Component Design

### Frontend Components (Phase 4+)

#### Chat Components
```
ChatPage (container)
├── ChatWindow
│   ├── MessageList
│   │   ├── UserMessage
│   │   ├── AssistantMessage
│   │   │   └── RecommendationCard (Phase 7)
│   │   └── TypingIndicator
│   └── ChatInput
```

#### Recommendation Components (Phase 7)
```
RecommendationCard
├── ClothingSection
│   └── ItemImage (for top/shirt/pant or frock)
├── JewellerySection
│   ├── ItemImage (earring)
│   └── ItemImage (chain/necklace)
├── FootwearSection
│   └── ItemImage (sandal/heel/flat)
└── RecommendationReason
    └── PreviousUseNotice (if applicable)
```

### Backend Services (Phase 2+)

#### AuthService
```typescript
class AuthService {
  async register(username, password): Promise<User>
  async login(username, password): Promise<{token, user}>
  async verifyToken(token): Promise<User>
}
```

#### RecommendationService
```typescript
class RecommendationService {
  async processUserRequest(
    userId, 
    userMessage
  ): Promise<{suggestions, explanation}>
}
```

#### RankingEngine
```typescript
class RankingEngine {
  scoreOutfit(outfit, eventRequest, preferences): number
  explainScore(outfit, breakdown): string
}
```

---

## Key Design Patterns

### 1. Service Layer Pattern

Business logic is centralized in services, not scattered across controllers.

```typescript
// ❌ BAD - Logic in controller
app.post('/api/recommendations', (req, res) => {
  const wardrobe = await Wardrobe.find({ userId: req.user.id });
  const filtered = wardrobe.filter(item => item.category === 'top');
  // ... more logic
});

// ✅ GOOD - Logic in service
class RecommendationService {
  async generateRecommendations(userId, eventRequest) {
    const wardrobe = await this.wardrobeService.getUserWardrobe(userId);
    const candidates = this.candidateGenerator.generate(wardrobe, eventRequest);
    const ranked = this.rankingEngine.rank(candidates);
    return ranked;
  }
}

app.post('/api/recommendations', async (req, res) => {
  const recommendations = await recommendationService.generate(
    req.user.id, 
    req.body.message
  );
  res.json(recommendations);
});
```

### 2. Provider Abstraction Pattern

AI provider is abstracted so changing it doesn't affect business logic.

```typescript
// Interface
interface AIProvider {
  parseEventRequest(message: string): Promise<EventRequest>
}

// Implementations
class GeminiProvider implements AIProvider { ... }
class GrokProvider implements AIProvider { ... }
class OllamaProvider implements AIProvider { ... }

// Factory
function createAIProvider(config): AIProvider {
  switch(config.AI_PROVIDER) {
    case 'gemini': return new GeminiProvider(config.GEMINI_API_KEY);
    case 'grok': return new GrokProvider(config.GROK_API_KEY);
    default: return new OllamaProvider(config.OLLAMA_BASE_URL);
  }
}

// Usage - business logic doesn't care which provider
const aiProvider = createAIProvider(config);
const eventRequest = await aiProvider.parseEventRequest(userMessage);
```

### 3. Repository Pattern (Recommended for Phase 2+)

Centralize database queries in repositories.

```typescript
// UserRepository handles all User queries
class UserRepository {
  async findById(id): Promise<User>
  async findByUsername(username): Promise<User>
  async create(user): Promise<User>
}

// Service uses repository
class AuthService {
  constructor(private userRepo: UserRepository) {}
  
  async login(username, password) {
    const user = await this.userRepo.findByUsername(username);
    // ...
  }
}
```

### 4. API Response Format

Consistent response format throughout the API.

```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "code": "SPECIFIC_ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

## Scalability Considerations

### Phase 1-3: Simple
- In-memory caching not needed
- Single backend instance
- Direct MongoDB queries

### Phase 4-6: Growing
- Consider adding TanStack Query (frontend caching)
- Consider adding Redis (backend caching)
- Consider MongoDB indexes

### Phase 7+: Large Scale
- Implement Redis caching layer
- Add background job processing (Bull, RabbitMQ)
- Consider read replicas for MongoDB
- Implement rate limiting
- Consider CDN for Cloudinary images

---

## Security Architecture

### Authentication
- JWT tokens (7-day expiry)
- Password hashing with bcryptjs
- Tokens in Authorization header

### Authorization
- User ID extracted from JWT (never from request body)
- Every query filtered by userId
- Cross-user data access prevented

### Input Validation
- Zod schemas for all API inputs
- MIME type validation for uploads
- File size limits (5MB images)

### Secrets Management
- Environment variables (.env)
- Never hardcoded credentials
- .gitignore protects secrets

---

## Future Architecture Considerations

### Phase 8: Scaling
- Database indexes on frequently queried fields
- Query optimization for wardrobe filtering
- Consider sharding if needed

### Phase 9+: Advanced Features
- Vector embeddings for semantic search
- MongoDB vector search for RAG
- Image recognition for metadata extraction
- Async job processing for AI calls

---

## Testing Architecture

### Unit Tests
- RankingEngine scoring logic
- AuthService password validation
- Zod schema validation

### Integration Tests
- API endpoints with database
- Authorization checks
- Error handling

### E2E Tests (Future)
- Complete user workflows
- Chat → Recommendation flow
- Image upload → Display

---

**Document Status:** Phase 1 - Foundation  
**To be updated:** Phase 2+
