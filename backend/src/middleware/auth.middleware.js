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

    req.auth = { userId: payload.sub };
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = {
  requireAuth,
};
