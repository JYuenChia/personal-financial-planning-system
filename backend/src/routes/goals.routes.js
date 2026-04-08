const express = require("express");

const router = express.Router();

const placeholder = (req, res) => {
  res.status(200).json({ status: "TO BE IMPLEMENT" });
};

router.get("/goals", placeholder);
router.post("/goals", placeholder);
router.get("/goals/:id", placeholder);
router.put("/goals/:id", placeholder);
router.delete("/goals/:id", placeholder);

module.exports = router;
