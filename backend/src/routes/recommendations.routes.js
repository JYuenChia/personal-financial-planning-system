const express = require("express");

const router = express.Router();

const placeholder = (req, res) => {
  res.status(200).json({ status: "TO BE IMPLEMENT" });
};

router.get("/recommendations/:goal_id", placeholder);
router.post("/strategies/compare", placeholder);

module.exports = router;
