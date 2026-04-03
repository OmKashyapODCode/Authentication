<h1 align="center">🔐 MERN Authentication & Authorization System</h1>

<p align="center">
Production-ready auth system with secure session management, refresh token rotation, and role-based access control.
</p>

---

## 📌 Overview

This project is a **production-grade authentication system** built using  
**MongoDB, Express, React, Node.js, and Redis**.

It implements **real-world security practices** like refresh token rotation, HTTP-only cookies,  
CSRF protection, and Redis-backed session management.

---

## 🚀 Live Demo

[https://authentication-odcode.onrender.com/](https://authentication-odcode.onrender.com/)

---

## 🧱 Tech Stack

### Frontend
- React (Hooks-based UI)
- Axios (with interceptors for auto refresh)
- React Router

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- Redis (session + token tracking)

### Security
- JWT (Access + Refresh Tokens)
- Refresh Token Rotation
- bcrypt (password hashing)
- CSRF Protection
- OTP-based Login (2FA)
- Email Verification

---

## ✨ Features

### 🔐 Authentication
- Register with Email Verification
- Email & Password Login
- OTP-based Login (2FA)
- Forgot & Reset Password
- Secure Logout (session invalidation)

### 🧑‍⚖️ Authorization
- Role-based Access Control (User / Admin)
- Protected Routes (Frontend + Backend)
- Admin-only APIs

### 🔁 Token & Session Management
- Access Token: **15 minutes**
- Refresh Token: **7 days**
- **Refresh Token Rotation (key feature)**
- Old refresh tokens are **invalidated after use**
- Prevents **replay attacks**
- Single active session per user
- Redis-backed session validation

---

## 🔁 How Token Rotation Works

1. User logs in → gets Access Token + Refresh Token  
2. Access token expires (15 min)  
3. Client calls `/refresh`  
4. Server:
   - Validates refresh token from Redis  
   - Generates new Access + Refresh token  
   - Deletes old refresh token  
5. New tokens are sent → session continues securely  

**Result:** Even if a refresh token is stolen, it becomes useless after one use.

---

## 🧪 API Routes

- POST /register  
- POST /verify/:token  
- POST /login  
- POST /verify (OTP)  
- POST /refresh (token rotation)  
- POST /logout  
- GET /me  
- GET /admin  
- POST /forgot-password  
- POST /reset-password/:token  

---

## ⚙️ Environment Variables

```env
MONGO_URI=
REDIS_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
EMAIL_SERVICE_API_KEY=
CLIENT_URL=
```

---

## 🛠 Local Setup

```bash
git clone <your-repo-url>
cd Authentication

npm install
cd Backend && npm install
cd ../Frontend && npm install

# setup env
cd ../Backend && cp .env.example .env
cd ../Frontend && cp .env.example .env

# run project
# terminal 1
cd Backend
npm run dev

# terminal 2
cd Frontend
npm start
```

---

## 🧠 Why This Project Stands Out

- Implements **refresh token rotation (used in real systems)**
- Uses **Redis for session control**
- Handles **secure auth flows end-to-end**
- Prevents **token reuse & replay attacks**
- Designed like a **production backend system**

---

## 👨‍💻 Author

**Om**  
Full-Stack Developer
