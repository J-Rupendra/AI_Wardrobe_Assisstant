# DATABASE.md

**Database configuration, schema design, and MongoDB Compass setup.**

## 📚 Table of Contents

- [Database Overview](#database-overview)
- [MongoDB Setup](#mongodb-setup)
- [Connection Configuration](#connection-configuration)
- [Data Models](#data-models)
- [Indexes](#indexes)
- [MongoDB Compass Guide](#mongodb-compass-guide)

---

## Database Overview

### Why MongoDB?

1. **Flexible Schema:** Perfect for iterative development
2. **Scalable:** Handles growing wardrobe data easily
3. **Developer Friendly:** JSON-like document structure
4. **Mongoose ODM:** Type-safe queries with TypeScript

### Phase 1 Status

No collections are created in Phase 1. This is Phase 2+ work.

The backend IS configured to connect to MongoDB and will verify the connection.

---

## MongoDB Setup

### Option 1: MongoDB Atlas (Cloud) - RECOMMENDED FOR DEVELOPMENT

MongoDB Atlas is the easiest way to get started.

#### Steps:

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Create" button
   - Choose "M0 Sandbox" (free tier)
   - Region: Choose your region (e.g., N. Virginia)
   - Cluster name: `ai-wardrobe-assistant`
   - Create cluster

3. **Create a Database User**
   - Go to "Security" → "Database Access"
   - Click "Add New Database User"
   - Username: `wardrobedev`
   - Password: Generate a strong password and copy it
   - Database User Privileges: "Built-in Role: Atlas Admin"
   - Add User

4. **Get Connection String**
   - Go to "Deployment" → "Database"
   - Click "Connect" on your cluster
   - Choose "Drivers"
   - Copy the connection string
   - It looks like: `mongodb+srv://wardrobedev:PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority`

5. **Configure in .env**
   ```
   MONGODB_URI=mongodb+srv://wardrobedev:YOUR_PASSWORD@cluster.mongodb.net/ai-wardrobe-assistant?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB

#### Windows

1. **Download MongoDB Community**
   - Go to https://www.mongodb.com/try/download/community
   - Choose your Windows version
   - Download and run the installer

2. **Install**
   - Follow the installer
   - Select "Install as a Service"
   - Choose complete setup

3. **Verify Installation**
   ```powershell
   mongosh
   ```
   Should start the MongoDB shell

4. **Configure .env**
   ```
   MONGODB_URI=mongodb://localhost:27017/ai-wardrobe-assistant
   ```

#### macOS

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Then in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/ai-wardrobe-assistant
```

#### Linux (Ubuntu)

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

---

## Connection Configuration

### Backend Connection

Located in `backend/src/config/database.ts`:

```typescript
import mongoose from 'mongoose';
import config from './env';

export async function connectDatabase(): Promise<void> {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    process.exit(1);
  }
}
```

### Environment Variable

```bash
# .env
MONGODB_URI=mongodb+srv://wardrobedev:PASSWORD@cluster.mongodb.net/ai-wardrobe-assistant?retryWrites=true&w=majority
```

### Connection String Format

**MongoDB Atlas:**
```
mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]?retryWrites=true&w=majority
```

**Local MongoDB:**
```
mongodb://localhost:27017/[database]
```

### Connection Verification

When backend starts, you should see:

```
✓ MongoDB connected successfully
✓ MongoDB connected to: cluster.mongodb.net
```

If you see an error, check:
1. MONGODB_URI in .env is correct
2. Database password is correct (no special characters need escaping in connection string)
3. MongoDB is running (if local)
4. Network access is allowed (if Atlas, add your IP)

---

## Data Models

### IMPORTANT: Phase 1 Status

**These models are NOT created in Phase 1.** This documentation shows the planned schema for future phases.

The models will be implemented in Phase 2 (User) and Phase 3+ (Wardrobe, etc.).

### USER Model (Phase 2)

```typescript
// backend/src/models/User.ts

interface IUser {
  _id: ObjectId;
  username: string;
  passwordHash: string;
  preferences: {
    preferredStyles: string[];
    preferredColors: string[];
    dislikedColors: string[];
    preferredFormality: number | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    match: /^[a-zA-Z0-9_-]+$/,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  preferences: {
    preferredStyles: [String],
    preferredColors: [String],
    dislikedColors: [String],
    preferredFormality: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
```

**Important:**
- `passwordHash` is ONE-WAY hashed with bcryptjs
- Never store plaintext passwords
- Never return passwordHash to frontend
- Username must be unique
- Preferences are optional

### WARDROBE_ITEM Model (Phase 3)

```typescript
// backend/src/models/WardrobeItem.ts

interface IWardrobeItem {
  _id: ObjectId;
  userId: ObjectId;           // Reference to User
  category: string;            // frock, top, shirt, pant, earring, chain, sandal, etc.
  subCategory?: string;        // More specific category
  name: string;                // e.g., "Blue Silk Top"
  colors: string[];            // e.g., ["blue"]
  material?: string;           // e.g., "silk"
  pattern?: string;            // e.g., "plain"
  styleTags: string[];         // e.g., ["elegant", "traditional"]
  occasionTags: string[];      // e.g., ["party", "engagement"]
  formality: number;           // 1-5 scale
  seasonTags?: string[];       // e.g., ["summer", "winter"]
  image: {
    url: string;              // Cloudinary URL
    publicId: string;         // Cloudinary public ID (for deletion)
    width?: number;
    height?: number;
  };
  active: boolean;            // Soft delete
  createdAt: Date;
  updatedAt: Date;
}

const WardrobeItemSchema = new Schema<IWardrobeItem>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: [
      'frock', 'top', 'shirt', 'pant',  // Clothing
      'earring', 'chain', 'necklace', 'bracelet',  // Jewellery
      'sandal', 'heel', 'flat',  // Footwear
    ],
    required: true,
  },
  subCategory: String,
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  colors: [String],
  material: String,
  pattern: String,
  styleTags: [String],
  occasionTags: [String],
  formality: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  seasonTags: [String],
  image: {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    width: Number,
    height: Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
```

### RECOMMENDATION_HISTORY Model (Phase 7+)

```typescript
// backend/src/models/RecommendationHistory.ts

interface IRecommendationHistory {
  _id: ObjectId;
  userId: ObjectId;
  eventRequest: string;       // The original user message
  itemIds: ObjectId[];        // IDs of wardrobe items in recommendation
  score: number;              // Ranking score
  shownAt: Date;              // When recommendation was shown
  selectedByUser?: boolean;   // User marked as favorite
  wornByUser?: boolean;       // User marked as worn
}

const RecommendationHistorySchema = new Schema<IRecommendationHistory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventRequest: {
    type: String,
    required: true,
  },
  itemIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'WardrobeItem',
    },
  ],
  score: {
    type: Number,
    required: true,
  },
  shownAt: {
    type: Date,
    default: Date.now,
  },
  selectedByUser: Boolean,
  wornByUser: Boolean,
});
```

---

## Indexes

### Why Indexes?

Indexes speed up queries. Create them on fields you query frequently.

### Recommended Indexes (Phase 3+)

```javascript
// User collection
db.users.createIndex({ username: 1 }, { unique: true })

// WardrobeItem collection
db.wardrobe_items.createIndex({ userId: 1 })
db.wardrobe_items.createIndex({ userId: 1, category: 1 })
db.wardrobe_items.createIndex({ userId: 1, active: 1 })
db.wardrobe_items.createIndex({ userId: 1, formality: 1 })

// RecommendationHistory collection
db.recommendation_histories.createIndex({ userId: 1 })
db.recommendation_histories.createIndex({ userId: 1, shownAt: -1 })
```

### When to Create Indexes

- After implementing a model
- Before adding 1000+ records
- When you notice slow queries
- Never on every field (indexes have maintenance cost)

---

## MongoDB Compass Guide

### What is MongoDB Compass?

MongoDB Compass is a GUI for viewing/managing MongoDB data. It's NOT the database itself.

It connects to the same MongoDB your backend connects to using the same MONGODB_URI.

### Download & Install

1. Go to https://www.mongodb.com/products/compass
2. Download for your OS
3. Install it

### Connecting Compass

#### To MongoDB Atlas

1. **Open Compass**
2. **Click "New Connection"**
3. **Paste your MONGODB_URI**
   - Copy from: DEVELOPMENT_CONTEXT.md or .env
   - Format: `mongodb+srv://wardrobedev:PASSWORD@cluster.mongodb.net/ai-wardrobe-assistant?retryWrites=true&w=majority`
4. **Click "Connect"**
5. You should see your databases

#### To Local MongoDB

1. **Open Compass**
2. **Default connection** (usually pre-filled)
   - Host: localhost
   - Port: 27017
3. **Click "Connect"**

### Viewing Collections

1. In Compass, expand your database (`ai-wardrobe-assistant`)
2. You'll see collections (created by Phase 2+):
   - `users`
   - `wardrobe_items`
   - `recommendation_histories`

### Viewing Documents

1. Click on a collection
2. Each document is displayed as JSON
3. You can:
   - See document structure
   - Search documents
   - Edit documents
   - Delete documents

### Inspecting User Data

```javascript
// In Compass, click collection, then see documents:
{
  "_id": ObjectId("..."),
  "username": "alice",
  "passwordHash": "$2b$10$...",  // Hashed password
  "preferences": {
    "preferredStyles": ["elegant", "traditional"],
    "preferredColors": ["gold", "blue"],
    "dislikedColors": ["neon"],
    "preferredFormality": 4
  },
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

### Inspecting Wardrobe Items

```javascript
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),  // Which user owns this
  "category": "top",
  "name": "Blue Silk Top",
  "colors": ["blue"],
  "material": "silk",
  "pattern": "plain",
  "styleTags": ["elegant", "traditional"],
  "occasionTags": ["party", "engagement"],
  "formality": 4,
  "image": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "ai-wardrobe/...",
    "width": 800,
    "height": 600
  },
  "active": true,
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

### Viewing Recommendation History

```javascript
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "eventRequest": "I have my friend's engagement next Saturday...",
  "itemIds": [
    ObjectId("..."),  // Top
    ObjectId("..."),  // Pant
    ObjectId("..."),  // Earring
    ObjectId("...")   // Sandal
  ],
  "score": 91,
  "shownAt": ISODate("2024-01-15T14:00:00.000Z"),
  "selectedByUser": true,
  "wornByUser": false
}
```

### Querying in Compass

Use the filter bar to search:

```javascript
// Find all items for user
{ "userId": ObjectId("...") }

// Find only tops
{ "category": "top" }

// Find active items
{ "active": true }

// Find formal items
{ "formality": { "$gte": 4 } }

// Find items worn in last 7 days
{ "updatedAt": { "$gte": ISODate("2024-01-08T00:00:00.000Z") } }
```

---

## Best Practices

1. **Never modify data directly in production** - Use your application
2. **Use Compass for inspection only** - Not primary data entry
3. **Keep backups** - MongoDB Atlas provides automatic backups
4. **Monitor storage** - MongoDB Atlas free tier has 512MB limit
5. **Understand indexes** - Too many slow down writes

---

## Troubleshooting

### Connection Issues

**Error: "authentication failed"**
- Check MONGODB_URI password
- Password special characters need to be URL-encoded
- Reset password in MongoDB Atlas if needed

**Error: "ERR_TLS_CERT_HAS_EXPIRED"**
- Update MongoDB driver: `npm install mongodb@latest`
- Update Node.js to latest LTS

**Error: "connection timeout"**
- Check if MongoDB is running (local) or cluster is active (Atlas)
- Check firewall/network
- Check IP whitelist in MongoDB Atlas

### Data Issues

**Collections not appearing**
- Phase 1 has no collections (created in Phase 2+)
- Wait until authentication is implemented

**Documents have missing fields**
- Phase 1: Only metadata, not real data
- This is expected

---

## Phase 2+: What to Expect

When Phase 2 is completed:

1. `users` collection will appear in Compass
2. You can see all registered users
3. You can inspect password hashes (never plaintext!)
4. You can see JWT tokens in memory (not stored)

---

**Document Status:** Phase 1 - Foundation  
**To be updated:** Phase 2 onwards

---

## Quick Reference

| Task | Command | Location |
|------|---------|----------|
| Connect backend | `npm run dev` | `backend/` |
| Test connection | `curl /api/health` | `http://localhost:5000/api/health` |
| Open Compass | Run Compass app | Installed on system |
| Connect Compass | Paste MONGODB_URI | Compass connection dialog |
| View collections | Expand database | Compass GUI |
| Check schema | Inspect document | Compass document view |
