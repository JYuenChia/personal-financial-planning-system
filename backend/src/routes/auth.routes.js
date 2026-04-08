const express = require("express");

const router = express.Router();

const placeholder = (req, res) => {
  res.status(200).json({ status: "TO BE IMPLEMENT" });
};

router.post("/auth/register", placeholder);
router.post("/auth/login", placeholder);
router.post("/auth/logout", placeholder);
router.post("/auth/refresh", placeholder);

module.exports = router;
