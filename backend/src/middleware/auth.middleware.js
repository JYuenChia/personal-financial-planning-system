const { verifyAccessToken } = require("../utils/auth.util");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const payload = verifyAccessToken(token);

    if (!payload || payload.type !== "access" || !payload.sub) {
      return res.status(401).json({ error: "Invalid access token" });
    }

    req.auth = {
      userId: payload.sub,
      role: payload.role === "admin" ? "admin" : "user",
    };
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.auth || req.auth.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  return next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};
