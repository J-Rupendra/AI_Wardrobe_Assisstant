# Developer Guide

## 1. Project purpose
This project is an AI wardrobe recommendation app. The main flow is:

1. User signs in.
2. User adds wardrobe items with image + metadata.
3. User describes an event in chat.
4. Backend parses the request with an AI provider.
5. Recommendation engine ranks matching wardrobe combinations.
6. Frontend displays recommendation cards and history.

## 2. Runtime setup

### Backend
- File: [backend/package.json](../backend/package.json)
- Run after dependencies are installed:
  - `cd backend`
  - `npm install`
  - `cp ../.env.example ../.env`
  - update `.env`
  - `npm run dev`

### Frontend
- File: [frontend/package.json](../frontend/package.json)
- Run after dependencies are installed:
  - `cd frontend`
  - `npm install`
  - `npm run dev`

The frontend dev server uses port 5173 and proxies API calls to backend port 5000 through [frontend/vite.config.ts](../frontend/vite.config.ts).

## 3. Environment variables
The environment file is loaded by [backend/src/config/env.ts](../backend/src/config/env.ts). Use the format in [.env.example](../.env.example).

### Required values
- `MONGODB_URI`
  - Example Atlas:
    `mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/ai-wardrobe-assistant`
  - Example local:
    `mongodb://localhost:27017/ai-wardrobe-assistant`
- `JWT_SECRET`
  - Example: `super-secret-dev-key`
- `AI_PROVIDER`
  - `gemini`, `grok`, or `ollama`
- `GEMINI_API_KEY`
  - Only for Gemini
- `GROK_API_KEY`
  - Only for Grok
- `OLLAMA_BASE_URL`
  - Only for Ollama local usage, example: `http://localhost:11434`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 4. Files to edit for common changes

### Auth and users
- [backend/src/services/auth/AuthService.ts](../backend/src/services/auth/AuthService.ts)
- [backend/src/controllers/authController.ts](../backend/src/controllers/authController.ts)
- [backend/src/middleware/authMiddleware.ts](../backend/src/middleware/authMiddleware.ts)
- [frontend/src/context/AuthContext.tsx](../frontend/src/context/AuthContext.tsx)
- [frontend/src/services/authApi.ts](../frontend/src/services/authApi.ts)

### Wardrobe flow
- [backend/src/models/WardrobeItem.ts](../backend/src/models/WardrobeItem.ts)
- [backend/src/services/wardrobe/WardrobeService.ts](../backend/src/services/wardrobe/WardrobeService.ts)
- [backend/src/controllers/wardrobeController.ts](../backend/src/controllers/wardrobeController.ts)
- [backend/src/routes/wardrobeRoutes.ts](../backend/src/routes/wardrobeRoutes.ts)
- [frontend/src/pages/WardrobePage.tsx](../frontend/src/pages/WardrobePage.tsx)
- [frontend/src/components/wardrobe/WardrobeForm.tsx](../frontend/src/components/wardrobe/WardrobeForm.tsx)

### Chat flow
- [backend/src/services/chat/ChatService.ts](../backend/src/services/chat/ChatService.ts)
- [backend/src/controllers/chatController.ts](../backend/src/controllers/chatController.ts)
- [backend/src/routes/chatRoutes.ts](../backend/src/routes/chatRoutes.ts)
- [frontend/src/pages/ChatPage.tsx](../frontend/src/pages/ChatPage.tsx)
- [frontend/src/services/chatApi.ts](../frontend/src/services/chatApi.ts)

### AI and recommendation flow
- [backend/src/services/ai/AIProvider.ts](../backend/src/services/ai/AIProvider.ts)
- [backend/src/services/ai/AIService.ts](../backend/src/services/ai/AIService.ts)
- [backend/src/services/recommendation/RankingEngine.ts](../backend/src/services/recommendation/RankingEngine.ts)
- [backend/src/services/recommendation/RecommendationService.ts](../backend/src/services/recommendation/RecommendationService.ts)
- [backend/src/controllers/recommendationController.ts](../backend/src/controllers/recommendationController.ts)
- [backend/src/routes/recommendationRoutes.ts](../backend/src/routes/recommendationRoutes.ts)

## 5. Backend to frontend flow

### Authentication request
- Frontend calls auth API in [frontend/src/services/authApi.ts](../frontend/src/services/authApi.ts).
- Express route is mounted in [backend/src/routes/authRoutes.ts](../backend/src/routes/authRoutes.ts).
- Controller validates with Zod in [backend/src/schemas/authSchemas.ts](../backend/src/schemas/authSchemas.ts).
- Service hashes password and creates JWT in [backend/src/services/auth/AuthService.ts](../backend/src/services/auth/AuthService.ts).
- Middleware validates the token in [backend/src/middleware/authMiddleware.ts](../backend/src/middleware/authMiddleware.ts).

### Wardrobe upload
- Frontend sends multipart form with image in [frontend/src/components/wardrobe/WardrobeForm.tsx](../frontend/src/components/wardrobe/WardrobeForm.tsx).
- Backend receives the file in [backend/src/routes/wardrobeRoutes.ts](../backend/src/routes/wardrobeRoutes.ts).
- Controller parses body and calls [backend/src/services/wardrobe/WardrobeService.ts](../backend/src/services/wardrobe/WardrobeService.ts).
- The image is uploaded to Cloudinary through [backend/src/services/cloudinary/CloudinaryService.ts](../backend/src/services/cloudinary/CloudinaryService.ts).

### Chat and recommendation generation
- User types message in [frontend/src/pages/ChatPage.tsx](../frontend/src/pages/ChatPage.tsx).
- Frontend calls [frontend/src/services/chatApi.ts](../frontend/src/services/chatApi.ts).
- Backend stores the message in [backend/src/services/chat/ChatService.ts](../backend/src/services/chat/ChatService.ts).
- AI parsing is done by [backend/src/services/ai/AIProvider.ts](../backend/src/services/ai/AIProvider.ts).
- Recommendation ranking is done in [backend/src/services/recommendation/RankingEngine.ts](../backend/src/services/recommendation/RankingEngine.ts).
- Final result is returned to the frontend and rendered as recommendation cards.

## 6. Current implementation status
This project is in a partially complete production-style state.

Completed or largely implemented:
- project foundation
- authentication
- wardrobe CRUD and file upload flow
- chat UI shell
- recommendation engine skeleton
- AI provider abstraction
- history model and endpoints

Not fully production-complete yet:
- full recommendation UI polishing
- end-to-end recommendation testing with real AI providers
- robust production deployment validation
- a full migration/test coverage pass

## 7. Good debugging workflow
- Read the route/controller/service chain first.
- Validate environment variables before debugging business logic.
- Check the backend JWT and database connection before UI debugging.
- Confirm Cloudinary uploads are configured if wardrobe images fail.
- Use MongoDB Atlas connection format exactly as shown in this guide.

## 8. Future release planning
- Current release: auth + wardrobe + chat + recommendation backend skeleton.
- Next release: fully polished recommendation UI and user history flows.
- Future release: better AI provider tuning, ranking refinements, and deployment hardening.
