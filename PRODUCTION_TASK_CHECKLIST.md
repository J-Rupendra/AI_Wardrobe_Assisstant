# Production Task Checklist

## Phase 0: Local verification baseline

### Goal
Verify the current MVP works with real environment variables before production hardening.

### Tasks
- [ ] Create a root `.env` file from `.env.example`.
- [ ] Set `MONGODB_URI` to a local or Atlas MongoDB instance.
- [ ] Set `JWT_SECRET` to a secure secret.
- [ ] Set Cloudinary credentials.
- [ ] Set one AI provider value: `gemini`, `grok`, or `ollama`.
- [ ] Install backend dependencies.
- [ ] Start backend and confirm `/api/health` responds.
- [ ] Install frontend dependencies.
- [ ] Start frontend and confirm the app loads without console-breaking startup errors.
- [ ] Verify the app loads the login page and the frontend proxy reaches backend.

### Expected outcome
The local MVP is running with real environment values and is stable enough for production upgrade work.

---

## Phase 1: Auth security hardening

### Files to inspect
- [backend/src/middleware/authMiddleware.ts](backend/src/middleware/authMiddleware.ts)
- [backend/src/services/auth/AuthService.ts](backend/src/services/auth/AuthService.ts)
- [backend/src/controllers/authController.ts](backend/src/controllers/authController.ts)
- [backend/src/routes/authRoutes.ts](backend/src/routes/authRoutes.ts)
- [frontend/src/context/AuthContext.tsx](frontend/src/context/AuthContext.tsx)
- [frontend/src/services/authApi.ts](frontend/src/services/authApi.ts)

### Tasks
- [ ] Review JWT secret usage and security assumptions.
- [ ] Validate login/register roles and user payloads.
- [ ] Confirm unauthorized requests return clean, consistent errors.
- [ ] Check token expiry behavior and logout flow.
- [ ] Ensure protected routes redirect users correctly after token expiry.
- [ ] Add explicit error handling for invalid/expired token cases.
- [ ] Review if `authToken` storage is secure enough for this MVP stage.

### Expected outcome
Authentication is secure, predictable, and easy to debug.

---

## Phase 2: Wardrobe robustness

### Files to inspect
- [backend/src/controllers/wardrobeController.ts](backend/src/controllers/wardrobeController.ts)
- [backend/src/services/wardrobe/WardrobeService.ts](backend/src/services/wardrobe/WardrobeService.ts)
- [backend/src/models/WardrobeItem.ts](backend/src/models/WardrobeItem.ts)
- [backend/src/routes/wardrobeRoutes.ts](backend/src/routes/wardrobeRoutes.ts)
- [backend/src/services/cloudinary/CloudinaryService.ts](backend/src/services/cloudinary/CloudinaryService.ts)
- [frontend/src/components/wardrobe/WardrobeForm.tsx](frontend/src/components/wardrobe/WardrobeForm.tsx)
- [frontend/src/pages/WardrobePage.tsx](frontend/src/pages/WardrobePage.tsx)

### Tasks
- [ ] Test item creation with valid image and metadata.
- [ ] Test item creation without image and with empty required fields.
- [ ] Validate file type restrictions and size limits.
- [ ] Confirm Cloudinary failure handling is user-friendly.
- [ ] Test delete flow and ensure Cloudinary cleanup works.
- [ ] Validate filter/search flows by category.
- [ ] Review missing/invalid data parsing in the form payload.
- [ ] Standardize API response shapes for CRUD endpoints.

### Expected outcome
Wardrobe upload, listing, and delete flows are stable and safe for real users.

---

## Phase 3: Chat + event parsing reliability

### Files to inspect
- [backend/src/controllers/chatController.ts](backend/src/controllers/chatController.ts)
- [backend/src/services/chat/ChatService.ts](backend/src/services/chat/ChatService.ts)
- [backend/src/routes/chatRoutes.ts](backend/src/routes/chatRoutes.ts)
- [backend/src/services/ai/AIProvider.ts](backend/src/services/ai/AIProvider.ts)
- [backend/src/services/ai/AIService.ts](backend/src/services/ai/AIService.ts)
- [frontend/src/pages/ChatPage.tsx](frontend/src/pages/ChatPage.tsx)
- [frontend/src/services/chatApi.ts](frontend/src/services/chatApi.ts)

### Tasks
- [ ] Test natural-language event messages for wedding, office, casual, party, date-night prompts.
- [ ] Confirm AI parser fallback works when provider fails.
- [ ] Validate malformed event request handling.
- [ ] Review chat storage ordering and retrieval logic.
- [ ] Improve assistant response behavior and user-facing error states.
- [ ] Confirm the app does not crash when AI response is incomplete.

### Expected outcome
The chat flow is robust even when AI output is incomplete or unavailable.

---

## Phase 4: Recommendation engine hardening

### Files to inspect
- [backend/src/services/recommendation/RankingEngine.ts](backend/src/services/recommendation/RankingEngine.ts)
- [backend/src/services/recommendation/RecommendationService.ts](backend/src/services/recommendation/RecommendationService.ts)
- [backend/src/controllers/recommendationController.ts](backend/src/controllers/recommendationController.ts)
- [backend/src/routes/recommendationRoutes.ts](backend/src/routes/recommendationRoutes.ts)

### Tasks
- [ ] Verify recommendation generation with empty wardrobe data.
- [ ] Validate minimal outfit generation for realistic use cases.
- [ ] Confirm scoring is consistent and deterministic.
- [ ] Add safer fallback when no suitable outfit matches are found.
- [ ] Review how `eventType`, colors, and `styleTags` influence ranking.
- [ ] Standardize recommendation response shape.
- [ ] Confirm outputs always contain valid item references and image URLs.

### Expected outcome
The engine produces stable, understandable outfits without failing on edge cases.

---

## Phase 5: Recommendation history and tracking

### Files to inspect
- [backend/src/models/RecommendationHistory.ts](backend/src/models/RecommendationHistory.ts)
- [backend/src/services/recommendation/RecommendationHistoryService.ts](backend/src/services/recommendation/RecommendationHistoryService.ts)
- [backend/src/controllers/recommendationHistoryController.ts](backend/src/controllers/recommendationHistoryController.ts)
- [backend/src/routes/recommendationHistoryRoutes.ts](backend/src/routes/recommendationHistoryRoutes.ts)

### Tasks
- [ ] Validate recommendation history is stored with correct user ID.
- [ ] Confirm item IDs and score values are recorded correctly.
- [ ] Review sorting and retrieval for recent history first.
- [ ] Add empty-state handling for users with no history.
- [ ] Review if recommendation records should be tied to a more detailed result schema.

### Expected outcome
History is reliable for debugging, analytics, and later user-facing history views.

---

## Phase 6: Security and API hardening

### Files to inspect
- [backend/src/app.ts](backend/src/app.ts)
- [backend/src/config/env.ts](backend/src/config/env.ts)
- [backend/src/config/database.ts](backend/src/config/database.ts)
- [backend/src/middleware/authMiddleware.ts](backend/src/middleware/authMiddleware.ts)

### Tasks
- [ ] Add request rate limiting.
- [ ] Add size limits for JSON and file uploads.
- [ ] Harden CORS configuration for real deployment domains.
- [ ] Standardize error handling across all routes.
- [ ] Add request logging and structured error messages.
- [ ] Prevent sensitive information from being leaked in responses.
- [ ] Validate the database connection and fail fast with clear logs.

### Expected outcome
The backend is safer and easier to operate in a real environment.

---

## Phase 7: Frontend quality and UX polish

### Files to inspect
- [frontend/src/App.tsx](frontend/src/App.tsx)
- [frontend/src/pages/LoginPage.tsx](frontend/src/pages/LoginPage.tsx)
- [frontend/src/pages/RegisterPage.tsx](frontend/src/pages/RegisterPage.tsx)
- [frontend/src/pages/ChatPage.tsx](frontend/src/pages/ChatPage.tsx)
- [frontend/src/pages/WardrobePage.tsx](frontend/src/pages/WardrobePage.tsx)
- [frontend/src/components/common/Button.tsx](frontend/src/components/common/Button.tsx)
- [frontend/src/components/common/Input.tsx](frontend/src/components/common/Input.tsx)
- [frontend/src/components/common/ErrorMessage.tsx](frontend/src/components/common/ErrorMessage.tsx)

### Tasks
- [ ] Review loading states across auth, wardrobe, and chat.
- [ ] Improve empty states and user guidance.
- [ ] Standardize API error display.
- [ ] Ensure route guards respond correctly when auth expires.
- [ ] Fix inconsistent user flows between register/login and dashboard pages.
- [ ] Add better fallback states for recommendation failures.

### Expected outcome
The app feels clean, stable, and understandable to a real user.

---

## Phase 8: Testing and reliability pass

### Files to inspect
- project root and package scripts
- backend test setup
- frontend test setup if added

### Tasks
- [ ] Add backend unit tests for auth service.
- [ ] Add backend tests for wardrobe controllers and services.
- [ ] Add API tests for chat endpoints.
- [ ] Add tests for recommendation generation logic.
- [ ] Add frontend tests for login/register and protected routes.
- [ ] Run lint, typecheck, and build verification.
- [ ] Fix failing tests before moving to deployment.

### Expected outcome
Critical behavior is covered by real tests instead of assumptions.

---

## Phase 9: Production deployment readiness

### Files to inspect
- [README.md](README.md)
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- [.env.example](.env.example)
- [backend/package.json](backend/package.json)
- [frontend/package.json](frontend/package.json)

### Tasks
- [ ] Finalize environment variable documentation.
- [ ] Add deployment notes for hosting providers.
- [ ] Prepare production configuration examples.
- [ ] Add health check and monitoring guidance.
- [ ] Document database and Cloudinary production setup.
- [ ] Review third-party service setup for AI provider usage.

### Expected outcome
The repo is ready for a deployment pass without hidden setup assumptions.

---

## Phase 10: Final release review

### Tasks
- [ ] Re-read setup docs and verify all links and instructions are correct.
- [ ] Ensure architecture docs match the current code.
- [ ] Confirm the app can be understood by another developer without prior session memory.
- [ ] Write release notes and known limitations.
- [ ] Verify the project is ready for a production-quality next iteration.

### Expected outcome
The codebase and docs are clear enough for future debugging and continued improvement.
