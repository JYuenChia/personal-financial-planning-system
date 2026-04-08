const express = require("express");

const router = express.Router();

const placeholder = (req, res) => {
  res.status(200).json({ status: "TO BE IMPLEMENT" });
};

router.post("/calculator/roi", placeholder);
router.post("/calculator/compare", placeholder);

module.exports = router;
