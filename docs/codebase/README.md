# Personal Financial Planning System — Codebase Documentation

**Generated:** May 2, 2026
**Repository:** JYuenChia/personal-financial-planning-system
**Status:** MVP (Early Stage)

This directory contains comprehensive documentation of the codebase structure, architecture, conventions, integrations, and known issues.

---

## 📄 Document Overview

### [STACK.md](./STACK.md) — Technology Stack
Runtime, frameworks, production dependencies, development toolchain, and key commands.

**Key findings:**
- **Runtime:** Node.js (CommonJS backend, Vanilla JS frontend)
- **Backend:** Express.js 5.2.1 + Mongoose 9.4.1 + MongoDB
- **Frontend:** Bootstrap 5.3.2 + Vanilla JS (no build step)
- **Auth:** JWT (jsonwebtoken 9.0.3) + bcryptjs password hashing
- **Validation:** Zod + Mongoose schemas

**Evidence:** backend/package.json, frontend/*.html (CDN links)

---

### [STRUCTURE.md](./STRUCTURE.md) — Directory Layout
Top-level organization, entry points, key files, naming conventions.

**Key findings:**
- **Backend:** Layered architecture (routes → repositories → db)
  - Feature-based routes: auth, user, goals, calculator, market, recommendations
  - Data access abstraction via repositories
  - Schemas co-locate Zod + Mongoose definitions
- **Frontend:** Flat HTML + JS structure (no build, no framework)
  - Centralized API client (api-client.js, 313 lines)
  - XSS prevention utilities (dom-utils.js)
  - Page-specific logic in \*.js files alongside \*.html

**Entry points:**
- Backend: `backend/src/server.js` → `npm start`
- Frontend: `frontend/index.html` (static, no build)

**Evidence:** Directory tree from scan, backend/package.json scripts

---

### [ARCHITECTURE.md](./ARCHITECTURE.md) — System Design & Patterns
Layers, data flow, design patterns, architectural decisions.

**Key findings:**
- **Pattern:** 3-layer architecture (HTTP → Routes → Repositories → MongoDB)
- **Auth flow:** POST /login → issue JWT tokens → auto-refresh on 401
- **Patterns used:**
  - Repository pattern (data access abstraction)
  - Middleware chain (JWT verification, role checks)
  - Singleton API client (frontend)
  - Schema separation (Zod validation + Mongoose storage)
  - Private model transformation (toPublicUser, never expose password_hash)
- **Trade-offs documented:** stateless JWT vs. token revocation DB lookup

**Data flow trace:** Login → find user → verify password → sign tokens → auto-refresh → logout blacklists tokens

**Evidence:** backend/src/server.js, middleware/auth.middleware.js, api-client.js

---

### [CONVENTIONS.md](./CONVENTIONS.md) — Code Standards
Naming, error handling, validation, import organization, security practices.

**Key findings:**
- **Naming:** camelCase (files, functions), snake_case (DB fields), kebab-case (HTML IDs)
- **Error handling:** HTTP error codes (400, 401, 403, 409, 500) + generic messages
- **Input validation:** Zod schemas (frontend payloads), Mongoose validation (DB level)
- **Async pattern:** async/await throughout (no callbacks)
- **Security:** bcryptjs (12 rounds), JWT signing, dom-utils.js (XSS prevention)
- **Imports:** CommonJS backend, script tags frontend (no ES modules)

**Evidence:** backend/src/routes/auth.routes.js, repositories/*.js, frontend/api-client.js

---

### [INTEGRATIONS.md](./INTEGRATIONS.md) — External Services & APIs
Third-party APIs, databases, secrets, monitoring.

**Key findings:**
- **Database:** MongoDB Atlas (cloud)
  - Collections: users, goals, calculations, revokedtokens
  - Connection via Mongoose 9.4.1
  - Credentials: MONGODB_URI in .env
- **External APIs:** [TODO] All placeholder (market news, trends, recommendations)
- **Third-party libraries:** mongoose, jsonwebtoken, bcryptjs, zod, validator, cors, uuid, dotenv
- **Frontend-backend:** Bearer token auth, fetch API, auto-refresh on 401
- **Monitoring:** console.log/error only (no APM, no logging framework)

**⚠️ Security issues:**
- MongoDB credentials committed in `.env` (CRITICAL)
- CORS allows all origins (HIGH)
- No rate limiting (MEDIUM)

**Evidence:** backend/.env, backend/src/server.js, frontend/api-client.js

---

### [TESTING.md](./TESTING.md) — Test Infrastructure & Coverage
Test setup, current gaps, manual testing checklist, security tests.

**Key findings:**
- **Status:** [TODO] No automated tests configured
  - backend/package.json: "test": "echo 'No tests configured'"
  - No Jest, Mocha, or test framework installed
  - No test files in directory tree
- **Coverage gaps:**
  - No unit tests (repositories, schemas)
  - No integration tests (routes + MongoDB)
  - No E2E tests (full user workflows)
  - No auth flow tests (token refresh, revocation)
- **Manual testing:** Comprehensive checklist provided (auth, CRUD, security tests)
- **CI/CD:** [TODO] No GitHub Actions workflow

**Recommended priorities:**
1. Auth tests (register, login, logout, refresh, revocation)
2. Goal CRUD with access control
3. Calculator operations
4. Security tests (token tampering, CSRF, injection)

**Evidence:** backend/package.json, scan output (no test frameworks detected)

---

### [CONCERNS.md](./CONCERNS.md) — Known Issues & Technical Debt
Security risks, performance bottlenecks, code quality, architectural concerns.

**Critical Issues (🔴 DO NOW):**
1. **MongoDB credentials in git** — Password exposed in `.env`
   - **Fix:** Rotate password, add `.env` to `.gitignore`, remove from history
2. **CORS allows all origins** — CSRF/XSS amplification
   - **Fix:** Restrict to frontend domain(s)

**High Priority (🟠 SOON):**
1. No rate limiting on auth endpoints (brute force possible)
2. JWT secret not validated (may be weak)
3. Placeholder endpoints (market, recommendations) need validation

**Medium Priority (🟡 PLAN):**
1. Token revocation scales poorly (DB query per request)
2. No database connection pooling config
3. No input validation framework (market endpoints)
4. No CI/CD pipeline
5. No automated tests

**Low Priority (🟢 LATER):**
1. No TypeScript (acceptable for MVP)
2. No Docker (can be added for deployment)
3. High-churn frontend files (goals.html, market-insights.html may be incomplete)
4. No .env.example documentation

**Risk matrix & next steps:** See full CONCERNS.md for prioritized remediation plan

**Evidence:** backend/.env, backend/src/server.js, scan output (high-churn files)

---

## 🎯 Quick Reference

### Project Intent
Personal financial planning system: track savings goals, calculate investment returns, get market insights and investment recommendations.

### Tech Stack at a Glance
```
Frontend: HTML5 + Vanilla JS + Bootstrap 5 (no build)
Backend: Express.js + Mongoose + MongoDB
Auth: JWT (Bearer tokens) + bcryptjs
Deployment: Node.js + MongoDB Atlas (cloud)
Testing: [TODO] Not configured
CI/CD: [TODO] Not configured
```

### Directory Layout
```
backend/src/
├── server.js              # Express entry point
├── db.js                  # MongoDB connection + models
├── routes/                # HTTP handlers (auth, goals, calculator, etc.)
├── repositories/          # Data access layer
├── middleware/            # Auth guards (JWT verification, role checks)
├── schemas/               # Zod + Mongoose validation
└── utils/                 # JWT signing/verification

frontend/
├── index.html             # Home page
├── api-client.js          # Centralized HTTP client (auto-refresh)
├── dom-utils.js           # XSS prevention
└── [page].html + [page].js # Feature pages (goals, calculator, etc.)
```

### Critical Commands

**Backend:**
```bash
npm install              # Install dependencies
npm start               # Start server (port 3000)
npm run dev             # Dev mode with --watch
npm test                # [TODO] Not configured
```

**Frontend:**
No build step. Served as static files.

### [ASK USER] Questions for Team Intent Clarification

Based on the codebase scan and documentation, here are clarifying questions:

1. **[ASK USER]** What is the intended deployment target?
   - Local development only?
   - Production cloud (AWS, Vercel, Heroku)?
   - Docker container?

2. **[ASK USER]** What market data sources should integrate with the market endpoints?
   - Alpha Vantage? Yahoo Finance? Polygon? Custom API?

3. **[ASK USER]** Should the investment recommendations be rule-based or ML-driven?
   - Simple rules (age-based allocation)?
   - ML model (trained on historical data)?
   - Third-party recommendation API?

4. **[ASK USER]** Is multi-user access / admin features intended?
   - Currently code supports `role: "admin"` but no admin endpoints exist

5. **[ASK USER]** What is the MVP completion checklist?
   - Current: Auth, Goals CRUD, Calculator, Profile
   - Missing: Market data, Recommendations (placeholders)
   - Testing? Deployment? Security audit?

---

## 🚨 Intent vs. Reality Divergences

### Gap 1: Placeholder Endpoints
**Stated in code (routes/market.routes.js, routes/recommendations.routes.js):**
```javascript
res.json({ status: "TO BE IMPLEMENTED" });
```

**Reality:** Market news, trends, ticker data, and recommendation engine are not wired.

**Implication:** Frontend pages (market-insights.html, recommendations.html) may display loading states or empty results.

### Gap 2: No Testing Infrastructure
**Typical expectations for production APIs:**
- Unit tests
- Integration tests
- Security tests
- CI/CD automation

**Reality:** No test framework, no CI/CD workflow, no test files.

**Implication:** Manual testing required; regression risk high; difficult to refactor confidently.

### Gap 3: Frontend-Backend Coupling
**README is minimal; no documentation of API contracts.**

**Reality:** Frontend assumes specific JSON response shapes (api-client.js hardcodes response field names).

**Implication:** Backend changes require frontend updates; no API versioning strategy.

---

## ✅ Validation Checklist

- [x] All 7 required documents created (STACK, STRUCTURE, ARCHITECTURE, CONVENTIONS, INTEGRATIONS, TESTING, CONCERNS)
- [x] Every claim traceable to source files, config, or terminal output
- [x] Unknowns marked as [TODO]
- [x] Team intent questions marked as [ASK USER]
- [x] Evidence lists included (file paths)
- [x] High-churn files identified (goals.html, market-insights.html, styles.css)
- [x] Security issues flagged with severity
- [x] Architecture diagrams included (ASCII art data flow)
- [x] Manual testing checklist provided
- [x] Next steps prioritized by risk/effort

---

## 📚 How to Use This Documentation

1. **Onboarding:** Read STACK.md + STRUCTURE.md first (15 min)
2. **Contributing:** Review CONVENTIONS.md for code style (10 min)
3. **Architecture understanding:** ARCHITECTURE.md explains layers & patterns (20 min)
4. **Security review:** CONCERNS.md lists all risks & mitigations (30 min)
5. **Integration work:** INTEGRATIONS.md shows external APIs & secrets (10 min)
6. **Testing strategy:** TESTING.md provides test checklist & examples (20 min)

**Total time to full understanding: ~1.5 hours**

---

## 📞 Recommended Actions (This Week)

### 🔴 Critical (Security)
- [ ] Rotate MongoDB password
- [ ] Remove `.env` from git history
- [ ] Add `.env` to `.gitignore`
- [ ] Configure CORS for specific origins
- [ ] Move JWT secret to `.env`

### 🟠 High Priority (Before Production)
- [ ] Add rate limiting to auth endpoints
- [ ] Validate market endpoint inputs (ticker symbols)
- [ ] Write integration tests for auth flow
- [ ] Set up GitHub Actions CI/CD

### 🟡 Medium Priority (Next Sprint)
- [ ] Create `.env.example`
- [ ] Write unit tests for repositories
- [ ] Review JWT secret strength
- [ ] Implement database connection pooling

---

**For detailed analysis of each area, refer to the individual markdown files in this directory.**
