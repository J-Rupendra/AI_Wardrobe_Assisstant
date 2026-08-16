# Production Readiness Upgrade Prompt

You are working on the AI Wardrobe Assistant MVP codebase. Your job is to turn this app from a local MVP into a production-ready application while preserving the current architecture and keeping the codebase maintainable.

## Objective
Upgrade the project so it is stable, secure, testable, and deployment-ready for real users while keeping the current feature set working locally.

## Current project context
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: MongoDB (MongoDB Atlas or local MongoDB)
- Storage: Cloudinary
- AI: Gemini / Grok / Ollama abstraction layer
- Auth: JWT-based auth with protected routes
- Core flows: auth, wardrobe upload, chat, recommendation generation, history storage

## Requirements
1. Make the app production-ready without breaking the MVP features.
2. Keep the code clean, modular, and easy for future debugging.
3. Add proper validation, error handling, and logging.
4. Strengthen security for secrets, auth, uploads, and API exposure.
5. Add tests for critical flows: auth, wardrobe CRUD, chat message save, recommendation generation.
6. Improve the recommendation engine quality with deterministic scoring and safer fallbacks.
7. Replace fragile local-only assumptions with safer production defaults.
8. Prepare deployment files and documented environment setup for staging/prod.
9. Ensure all environment settings are centralized and documented.
10. Maintain a clear architecture and developer onboarding documents.

## Key tasks to complete
### Security
- Move all secrets to environment variables only.
- Ensure frontend never contains API keys or production secrets.
- Validate upload file type, size, and file naming.
- Add rate limiting and request-size protection.
- Harden JWT handling, auth middleware, and session logic.
- Add secure CORS config for production domains.

### Backend reliability
- Verify database connection and retry behavior.
- Add graceful error handling for MongoDB failures, Cloudinary failures, and AI provider issues.
- Add request validation for all routes, not only core ones.
- Standardize API response format across controllers.
- Add structured logging and request ID tracing.
- Add auditing for recommendation generation and user activity.

### AI and recommendations
- Make AI provider fallbacks robust and deterministic.
- Ensure recommendation generation works even if AI provider is unavailable.
- Improve outfit ranking logic with real-world constraints.
- Add filters for invalid combinations and empty wardrobe states.
- Keep images attached to recommendations from actual wardrobe items.

### Frontend quality
- Fix inconsistent form patterns and error display.
- Add loading, empty, and retry states across pages.
- Improve protected route behavior after token expiry.
- Ensure the app works cleanly with backend errors and auth expiry.
- Standardize API client error handling.

### Deployment readiness
- Add production build config and environment templates.
- Add Docker or deployment configuration if suitable.
- Document environment variables for staging and production.
- Add health checks and deployment notes.
- Add instructions for production MongoDB and Cloudinary configuration.

### Testing
- Add unit tests for auth service and validation logic.
- Add integration tests for protected routes and wardrobe CRUD.
- Add tests for recommendation generation and fallback logic.
- Add frontend tests for login, registration, and auth guard behavior.
- Run lint/typecheck/build verification before completion.

## Deliverables
Produce the following:
1. updated code with production-level quality improvements
2. production-safe environment template
3. deployment-ready configuration files
4. final update to project documentation
5. clear summary of what changed and why

## Constraints
- Do not break the current MVP user flow.
- Keep the architecture understandable for future debugging.
- Do not hide problems with silent failover unless there is a strong fallback and log.
- Prefer deterministic logic and simple maintainable code over overengineering.

## Success criteria
The project is considered production-ready when:
- local MVP runs reliably with valid env values
- all critical flows are tested
- auth and uploads are secure
- AI and recommendation generation degrade gracefully
- deployment instructions are documented clearly
- future developers can understand the app from the docs and code structure alone
