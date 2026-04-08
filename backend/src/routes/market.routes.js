const express = require("express");

const router = express.Router();

const placeholder = (req, res) => {
  res.status(200).json({ status: "TO BE IMPLEMENT" });
};

router.get("/market/news", placeholder);
router.get("/market/trends", placeholder);
router.get("/market/ticker/:symbol", placeholder);

module.exports = router;
