# SECURITY.md

**Security implementation guide and best practices.**

## 📚 Table of Contents

- [Security Overview](#security-overview)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Data Protection](#data-protection)
- [API Security](#api-security)
- [Secrets Management](#secrets-management)
- [Common Vulnerabilities](#common-vulnerabilities)

---

## Security Overview

### Principles

1. **Principle of Least Privilege:** Only give minimum required access
2. **Defense in Depth:** Multiple layers of security
3. **Fail Secure:** Better to reject legitimate request than allow malicious one
4. **Secret Management:** Never expose secrets

### Phase 1 Status

Phase 1 establishes security foundations:
- TypeScript strict mode
- Environment variables for secrets
- .gitignore protection
- No secrets in codebase

Authentication (JWT, bcryptjs) is Phase 2.

---

## Authentication

### Phase 1: Foundation
- [x] Environment variables for secrets
- [x] No hardcoded credentials

### Phase 2: Implementation

#### Password Hashing

**NEVER do this:**
```typescript
// ❌ WRONG - Plaintext password in database
const user = new User({
  username: 'alice',
  password: 'mysecretpassword',  // WRONG!
});
await user.save();
```

**DO this:**
```typescript
// ✅ CORRECT - Hash password with bcryptjs
import bcryptjs from 'bcryptjs';

const hashedPassword = await bcryptjs.hash(password, 10);
const user = new User({
  username: 'alice',
  passwordHash: hashedPassword,
});
await user.save();
```

#### JWT Tokens

**Token Structure:**
```
Header: { alg: 'HS256', typ: 'JWT' }
Payload: { userId, username, iat, exp }
Signature: HMAC-SHA256(secret)
```

**Generation (Phase 2):**
```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: user._id, username: user.username },
  config.jwtSecret,
  { expiresIn: '7d' }
);
```

**Verification (Phase 2):**
```typescript
const payload = jwt.verify(token, config.jwtSecret);
const userId = payload.userId;  // This is trusted!
```

**Frontend Usage (Phase 2):**
```typescript
// Store token in memory (not localStorage to prevent XSS)
let authToken = null;

// Send in Authorization header
axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

// Backend extracts from header
const token = req.headers.authorization.split(' ')[1];
const payload = jwt.verify(token, config.jwtSecret);
```

#### Password Requirements

Enforce strong passwords:
```typescript
// backend/src/schemas/authSchemas.ts

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, _, -'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[0-9]/, 'Password must contain number')
    // Don't enforce special characters (accessibility)
});
```

---

## Authorization

### Phase 1: Foundation
- [x] No authorization logic yet (Phase 2+)

### Phase 2+: Implementation

#### User ID from JWT (NOT from request)

**WRONG: Trust user ID from request**
```typescript
// ❌ WRONG - Trusting frontend
app.get('/api/wardrobe', (req, res) => {
  const userId = req.body.userId;  // User can fake this!
  const items = await Wardrobe.find({ userId });
  res.json(items);
});
```

**CORRECT: Extract from JWT**
```typescript
// ✅ CORRECT - Extract from verified JWT
app.get('/api/wardrobe', authenticateToken, (req, res) => {
  const userId = req.user.id;  // From verified JWT
  const items = await Wardrobe.find({ userId });
  res.json(items);
});
```

#### Query Filtering

Every query must filter by authenticated user:

```typescript
// ✅ User can only see their own wardrobe
app.get('/api/wardrobe/:id', authenticateToken, async (req, res) => {
  const item = await Wardrobe.findById(req.params.id);
  
  // Verify ownership
  if (item.userId.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  res.json(item);
});
```

#### Cross-User Protection

```typescript
// ❌ WRONG - No ownership check
app.delete('/api/wardrobe/:id', async (req, res) => {
  await Wardrobe.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
// User can delete anyone's items!

// ✅ CORRECT - Verify ownership
app.delete('/api/wardrobe/:id', authenticateToken, async (req, res) => {
  const item = await Wardrobe.findById(req.params.id);
  
  if (!item || item.userId.toString() !== req.user.id) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  await item.deleteOne();
  res.json({ success: true });
});
```

---

## Data Protection

### Sensitive Fields

**Never return to frontend:**
- `passwordHash`
- `jwtSecret` (config)
- API keys (Gemini, Grok, Cloudinary)
- Internal IDs (if user shouldn't know)

**Sanitize before sending:**
```typescript
// Backend returns User without passwordHash
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  
  // Remove sensitive fields
  const { passwordHash, ...safeUser } = user.toObject();
  
  res.json(safeUser);
});

// Response
{
  "_id": "...",
  "username": "alice",
  "preferences": { ... }
}
```

### Field-Level Encryption (Future)

For extremely sensitive data (future phases):
```typescript
// Encrypt sensitive metadata
const encryptedMetadata = encrypt(item.styleTags, encryptionKey);
```

But for Phase 1-6, database-level encryption is sufficient.

---

## API Security

### CORS (Cross-Origin Resource Sharing)

**Phase 1: Foundation**
```typescript
// backend/src/app.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

**In Production:**
```typescript
app.use(cors({
  origin: 'https://yourdomain.com',  // Specific domain
  credentials: true,
}));
```

### HTTPS/TLS

**Phase 1: Development**
- HTTP is fine for localhost

**Production (Phase 9):**
- Always use HTTPS
- Get SSL certificate (Let's Encrypt is free)
- Force HTTPS redirect

### Rate Limiting (Phase 6+)

Prevent brute force attacks:
```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // Max 5 attempts per window
  message: 'Too many login attempts, please try again later',
});

app.post('/api/auth/login', loginLimiter, authController.login);
```

### Input Validation

**Always validate with Zod:**
```typescript
import { z } from 'zod';

const createWardrobeSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.enum(['frock', 'top', 'shirt', 'pant', ...]),
  colors: z.array(z.string()).min(1),
  formality: z.number().min(1).max(5),
});

app.post('/api/wardrobe', (req, res) => {
  const validated = createWardrobeSchema.parse(req.body);
  // Now validated is safe
});
```

### Error Handling

**Never expose stack traces to users:**
```typescript
// ❌ WRONG
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,  // Stack trace visible!
    stack: err.stack,    // Stack trace visible!
  });
});

// ✅ CORRECT
app.use((err, req, res, next) => {
  console.error('Error:', err);  // Log internally
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.env === 'production' 
        ? 'An error occurred' 
        : err.message,
    },
  });
});
```

---

## Secrets Management

### Environment Variables

**Phase 1: Foundation**
- [x] Use `.env` for secrets
- [x] `.env` in `.gitignore`
- [x] `.env.example` as template

**Never do this:**
```typescript
// ❌ WRONG - Hardcoded secret
const jwtSecret = 'super-secret-key-12345';
const mongoUrl = 'mongodb+srv://user:password@...';
```

**Do this:**
```typescript
// ✅ CORRECT - Environment variables
import config from './config/env';
const jwtSecret = config.jwtSecret;
const mongoUrl = config.mongodbUri;
```

### Secret Rotation (Future)

For production (Phase 9+):
- Rotate JWT_SECRET regularly
- Use AWS Secrets Manager or similar
- Implement secret versioning

### Accessing Secrets in Different Environments

```bash
# Development (.env)
JWT_SECRET=dev-secret-do-not-use

# Production (environment)
export JWT_SECRET=$(aws secretsmanager get-secret-value ...)
```

---

## Common Vulnerabilities

### 1. SQL Injection (MongoDB Injection)

**MongoDB is not vulnerable to SQL injection, but NoSQL injection is possible:**

```typescript
// ❌ WRONG - Unsafe query construction
const username = req.body.username;
const user = await User.findOne({ 
  username: username,  // If username = {$ne: null}, finds anyone!
});

// ✅ CORRECT - Mongoose handles escaping
const validated = z.string().parse(req.body.username);  // Validate first
const user = await User.findOne({ username: validated });
```

### 2. XSS (Cross-Site Scripting)

**Phase 4: Chat UI will need XSS protection**

```typescript
// React automatically escapes text
// But be careful with dangerouslySetInnerHTML

// ✅ SAFE - React escapes
<div>{userMessage}</div>

// ❌ DANGEROUS - Don't do this
<div dangerouslySetInnerHTML={{ __html: userMessage }} />
```

### 3. CSRF (Cross-Site Request Forgery)

**Phase 2+: Use CORS properly**

```typescript
// ✅ CORRECT - CORS restricts origin
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true,
}));

// Frontend must be on same origin or CORS-allowed
```

### 4. Broken Authentication

**Phase 2: Implement properly**

```typescript
// ✅ CORRECT - Strong hashing, JWT verification
const hashedPassword = await bcryptjs.hash(password, 10);
const token = jwt.sign(payload, secret, { expiresIn: '7d' });
const verified = jwt.verify(token, secret);
```

### 5. Sensitive Data Exposure

**Phase 1+: Always protect secrets**

```typescript
// ✅ Secrets in .env only
// ❌ Never in version control
// ❌ Never in frontend code
```

### 6. Insufficient Authorization

**Phase 2+: Check ownership**

```typescript
// ❌ WRONG - No ownership check
await Wardrobe.findByIdAndDelete(id);

// ✅ CORRECT - Verify ownership
const item = await Wardrobe.findById(id);
if (item.userId !== req.user.id) throw new Error('Unauthorized');
await item.deleteOne();
```

---

## Security Checklist (Phase 1)

- [x] TypeScript strict mode
- [x] Environment variables for secrets
- [x] .gitignore configured
- [x] No secrets in code
- [x] No default credentials
- [x] Helmet middleware added
- [x] CORS configured

## Security Checklist (Phase 2)

- [ ] Password hashing with bcryptjs
- [ ] JWT token generation
- [ ] JWT verification middleware
- [ ] User ID from JWT (not request)
- [ ] Query filtering by user
- [ ] Ownership verification
- [ ] Password validation rules
- [ ] Rate limiting on auth endpoints
- [ ] Zod input validation

## Security Checklist (Phase 3+)

- [ ] File upload validation (MIME, size)
- [ ] Cloudinary security
- [ ] API key rotation
- [ ] HTTPS in production
- [ ] Error message sanitization
- [ ] Logging sensitive data check
- [ ] XSS prevention (React escaping)

---

## Testing Security (Phase 2+)

```typescript
// Attempt to access another user's data
test('should prevent cross-user access', async () => {
  const user1 = await createUser('alice');
  const user2 = await createUser('bob');
  
  const item = await createWardrobeItem(user1._id);
  
  // Bob tries to access Alice's item
  const res = await request(app)
    .get(`/api/wardrobe/${item._id}`)
    .set('Authorization', `Bearer ${user2Token}`);
  
  expect(res.status).toBe(404);  // Item not found (not "forbidden")
});
```

---

## Security Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- bcryptjs: https://www.npmjs.com/package/bcryptjs
- JWT: https://jwt.io
- Zod: https://zod.dev
- Helmet: https://helmetjs.github.io

---

**Document Status:** Phase 1 - Foundation, Phase 2+ roadmap  
**Implementation Phases:** 2, 3, 6, 9
