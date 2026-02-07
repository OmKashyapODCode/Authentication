<h1 style="color:#f0f6fc;">🔐 Authentication & Authorization System (MERN)</h1>

<h2 style="color:#58a6ff;">📌 Overview</h2>
<p style="line-height:1.6;">
A production-grade authentication and authorization system built using
<strong>MongoDB, Express, React, Node.js, Redis</strong> with secure session handling,
role-based access control, and multiple authentication flows.
</p>
<p style="line-height:1.6;">
Designed with a strong focus on <strong>security, scalability, and real-world authentication patterns</strong>.
</p>

<hr />

<h3 style="color:#3fb950;">🚀 Live Demo</h3>
<p>
<a href="https://authentication-odcode.onrender.com/" target="_blank" style="color:#58a6ff;">
https://authentication-odcode.onrender.com/
</a>
</p>

<hr />

<h2 style="color:#58a6ff;">🧱 Tech Stack</h2>

<h3 style="color:#f78166;">🎨 Frontend</h3>
<ul>
  <li>⚛️ React (State-based UI)</li>
  <li>🌐 Axios (Interceptors)</li>
  <li>🧭 React Router</li>
</ul>

<h3 style="color:#f78166;">🛠 Backend</h3>
<ul>
  <li>🟢 Node.js</li>
  <li>🚂 Express.js</li>
  <li>🍃 MongoDB (Mongoose)</li>
  <li>⚡ Redis (Session & Token Tracking)</li>
</ul>

<h3 style="color:#f78166;">🔒 Security</h3>
<ul>
  <li>🔑 JWT (Access + Refresh Tokens)</li>
  <li>🧂 bcrypt (Password Hashing)</li>
  <li>🛡 CSRF Protection</li>
  <li>📲 OTP-based Authentication (2FA)</li>
  <li>📧 Email Verification</li>
</ul>

<hr />

<h2 style="color:#58a6ff;">✨ Core Features</h2>

<h3>🔐 Authentication</h3>
<ul>
  <li>User Registration with Email Verification</li>
  <li>Email & Password Login</li>
  <li>OTP-based Login (2FA)</li>
  <li>Secure Logout</li>
  <li>Password Reset (Forgot & Reset)</li>
</ul>

<h3>🧑‍⚖️ Authorization</h3>
<ul>
  <li>Role-based Access Control (User / Admin)</li>
  <li>Protected Frontend & Backend Routes</li>
  <li>Admin-only APIs</li>
</ul>

<h3>🔁 Token & Session Management</h3>
<ul>
  <li>⏱ Access Token — <strong>15 minutes</strong></li>
  <li>🗓 Refresh Token — <strong>7 days</strong></li>
  <li>📌 Single Active Session per User</li>
  <li>⚡ Redis-backed Sessions</li>
</ul>

<hr />

<h2 style="color:#58a6ff;">🧪 Backend API Routes</h2>

<ul>
  <li><code>POST /register</code></li>
  <li><code>POST /verify/:token</code></li>
  <li><code>POST /login</code></li>
  <li><code>POST /verify</code> (OTP)</li>
  <li><code>POST /refresh</code></li>
  <li><code>POST /logout</code></li>
  <li><code>GET /me</code></li>
  <li><code>GET /admin</code></li>
  <li><code>POST /forgot-password</code></li>
  <li><code>POST /reset-password/:token</code></li>
</ul>

<hr />

<h2 style="color:#58a6ff;">⚙️ Environment Variables</h2>
<pre style="background:#161b22;padding:12px;border-radius:6px;">
MONGO_URI=
REDIS_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
EMAIL_SERVICE_API_KEY=
CLIENT_URL=
</pre>

<hr />

<h2 style="color:#58a6ff;">🛠 Local Setup</h2>

<pre style="background:#161b22;padding:12px;border-radius:6px;">
git clone &lt;your-repo-url&gt;
cd Authentication

npm install
cd Backend && npm install
cd ../Frontend && npm install

cd ../Backend
cp .env.example .env

cd ../Frontend
cp .env.example .env

# Terminal 1
cd Backend
npm run dev

# Terminal 2
cd Frontend
npm start
</pre>

<hr />

<h2 style="color:#58a6ff;">🚀 Future Enhancements</h2>
<ul>
  <li>🔄 Refresh Token Rotation</li>
  <li>🔐 User-managed 2FA enable/disable</li>
  <li>🔑 OAuth (Google, GitHub)</li>
  <li>📱 Phone number authentication with OTP</li>
</ul>

<hr />

<h2 style="color:#58a6ff;">👨‍💻 Author</h2>
<p>
<strong>Om</strong><br />
Full-Stack Engineer
</p>
