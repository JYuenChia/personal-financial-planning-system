const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(128),
});

const refreshSchema = z.object({
  refresh_token: z.string().min(1),
});

module.exports = {
  loginSchema,
  refreshSchema,
};