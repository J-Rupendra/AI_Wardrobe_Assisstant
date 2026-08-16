# User Guide

## 1. Start the app
1. Create a `.env` file from [.env.example](../.env.example).
2. Fill in your MongoDB Atlas or local MongoDB string.
3. Fill in Cloudinary and AI provider values.
4. Start backend:
   - `cd backend`
   - `npm install`
   - `npm run dev`
5. Start frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
6. Open `http://localhost:5173`

## 2. Sign up and sign in
- Create a new account from the login/register page.
- Use a unique username and a secure password.
- After login, the app keeps the session in the browser.

## 3. Add wardrobe items
- Open the wardrobe page.
- Click Add Item.
- Enter item name, category, colors, formality, and optional tags.
- Upload an image.
- Save the item.

## 4. Chat with the assistant
- Go to the chat page.
- Describe the event using a message like:
  - "I have a wedding dinner tomorrow and need a classy look."
  - "I need an office outfit in black and white."
- The backend parses your request and prepares outfit recommendations.

## 5. View recommendations
- Recommendations appear from your actual wardrobe items.
- Each recommendation includes a score, reason, and outfit composition.
- The app is designed to use real item photos from Cloudinary.

## 6. History
- Recommendation history can be queried from the app backend once the history flow is active.
- It records which outfits were generated and shown to the user.

## 7. Troubleshooting
- If the page does not load, verify backend is running on port 5000.
- If login fails, check JWT_SECRET and MongoDB URI.
- If image upload fails, verify Cloudinary keys and upload permissions.
- If recommendations seem poor, review the AI provider selection and event parsing logic.

## 8. Security and privacy
- Do not share your `.env` file.
- Do not expose secrets in the frontend.
- Use strong JWT secrets in production.
- Keep MongoDB credentials inside environment variables only.
