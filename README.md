# 🔐 Authentication & Authorization System (MERN)

## 📌 Overview
A production-grade authentication and authorization system built using  
**MongoDB, Express, React, Node.js, Redis** with secure session handling,
role-based access control, and multiple authentication flows.

Designed with a strong focus on **security, scalability, and real-world authentication patterns**.

---

## 🧱 Tech Stack

### 🎨 Frontend
- ⚛️ React (State-based UI)
- 🌐 Axios (Interceptors)
- 🧭 React Router

### 🛠 Backend
- 🟢 Node.js
- 🚂 Express.js
- 🍃 MongoDB (Mongoose)
- ⚡ Redis (Session & Token Tracking)

### 🔒 Security
- 🔑 JWT (Access + Refresh Tokens)
- 🧂 bcrypt (Password Hashing)
- 🛡 CSRF Protection
- 📲 OTP-based Authentication (2FA)
- 📧 Email Verification

---

## ✨ Core Features

### 🔐 Authentication
- User Registration with Email Verification
- Email & Password Login
- OTP-based Login (2FA)
- Secure Logout
- Password Reset (Forgot & Reset)

### 🧑‍⚖️ Authorization
- Role-based Access Control (User / Admin)
- Protected Frontend & Backend Routes
- Admin-only APIs

### 🔁 Token & Session Management
- ⏱ Access Token — **15 minutes**
- 🗓 Refresh Token — **7 days**
- 📌 Single Active Session per User
- ⚡ Redis-backed Sessions

---

## 🧪 Backend API Routes

### Auth
- `POST /register`
- `POST /verify/:token`
- `POST /login`
- `POST /verify` (OTP)
- `POST /refresh`
- `POST /logout`

### User
- `GET /me`

### Admin
- `GET /admin`

### Password Reset
- `POST /forgot-password`
- `POST /reset-password/:token`

---

## 🔄 Authentication Flow

### 📝 Registration
1. User registers with email & password
2. Password hashed using bcrypt
3. Verification email sent
4. Email verified via token

### 🚪 Login
1. Credentials validated
2. Access & Refresh tokens generated
3. Session stored in Redis
4. Tokens sent via HTTP-only cookies

### ♻️ Token Refresh
1. Access token expires
2. Axios interceptor triggers `/refresh`
3. New access token issued
4. Session validated via Redis

---

## ⚡ Redis Usage
- Tracks active sessions
- Ensures single active login per user
- Invalidates old sessions on re-login
- Handles logout & token blacklisting

---

## 🖥 Frontend Handling
- Access token stored **in memory**
- Refresh token stored in **HTTP-only cookies**
- Axios interceptors handle refresh & auto-logout

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
## 🚀 Future Enhancements

### 🔄 Refresh Token Rotation
- Implement rotating refresh tokens on every `/refresh` request
- Invalidate the previous refresh token after issuing a new one
- Prevents token replay attacks if a refresh token is compromised
- Improves overall session security in distributed systems

---

### 🔐 User-Managed Two-Factor Authentication (2FA)
- Allow users to **enable or disable 2FA after login** from account settings
- 2FA preference stored per user in the database
- OTP verification required only when 2FA is enabled
- Balances strong security with user flexibility

---

### 🔑 OAuth Authentication
- Support third-party login providers:
  - Google OAuth
  - GitHub OAuth
- Reduces friction during onboarding
- Delegates identity verification to trusted providers
- Useful for enterprise and consumer-facing applications

---

### 📱 Phone Number Authentication
- Enable login and registration using phone numbers
- OTP-based verification via SMS
- Can be used as:
  - Primary authentication method
  - Backup authentication option
- Enhances accessibility for mobile-first users
## 👨‍💻 Author

**Om**  
Full-Stack Engineer  
