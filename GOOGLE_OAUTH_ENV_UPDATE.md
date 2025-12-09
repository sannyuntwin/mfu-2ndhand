# Google OAuth Environment Variables Update

## ✅ **Your Google OAuth Credentials Are Ready!**

I can see you already have:
- `GOOGLE_CLIENT_ID=YOUR_SECRET_HERE`
- `GOOGLE_CLIENT_SECRET=YOUR_SECRET_HERE`

## 🔧 **Add These Missing Environment Variables**

Please add these two lines to your `backend/.env` file:

```env
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

## 📝 **Your Updated .env Should Include:**

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Frontend URL for OAuth redirects
FRONTEND_URL=http://localhost:3000
```

## 🎯 **Frontend Environment Variables**

Also add this to your `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

## ✅ **Then Run Database Migration**

```bash
cd backend
npx prisma migrate dev --name add_google_oauth_fields
```

## 🚀 **Test the Google OAuth**

1. Start backend: `cd backend && npm run start:dev`
2. Start frontend: `cd frontend && npm run dev`
3. Go to login page and click "Continue with Google"

Your Google OAuth integration is ready to use!