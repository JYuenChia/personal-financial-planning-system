const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const validator = require("validator");
const { z } = require("zod");

const {
  createUser,
  findByEmail,
} = require("../repositories/user.repository");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/auth.util");

const router = express.Router();

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(128),
  full_name: z.string().trim().min(1).max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(128),
});

const refreshSchema = z.object({
  refresh_token: z.string().min(1),
});

function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user._id,
    email: user.email,
    full_name: user.full_name,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

router.post("/auth/register", async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid registration payload" });
    }

    const { email, password, full_name } = parsed.data;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const existingUser = await findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const user = await createUser({
      _id: uuidv4(),
      email,
      password_hash,
      full_name: full_name || null,
    });

    const publicUser = toPublicUser(user);

    return res.status(201).json({
      user: publicUser,
      access_token: signAccessToken(publicUser.id),
      refresh_token: signRefreshToken(publicUser.id),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid login payload" });
    }
    const { email, password } = parsed.data;
    const user = await findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const publicUser = toPublicUser(user);

    return res.status(200).json({
      user: publicUser,
      access_token: signAccessToken(publicUser.id),
      refresh_token: signRefreshToken(publicUser.id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", (req, res) => {
  return res.status(200).json({ status: "logged_out" });
});

router.post("/auth/refresh", (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid refresh payload" });
  }

  try {
    const payload = verifyRefreshToken(parsed.data.refresh_token);

    if (!payload || payload.type !== "refresh" || !payload.sub) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    return res.status(200).json({
      access_token: signAccessToken(payload.sub),
    });
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

module.exports = router;
