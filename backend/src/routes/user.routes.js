const express = require("express");

const router = express.Router();

const placeholder = (req, res) => {
  res.status(200).json({ status: "TO BE IMPLEMENT" });
};

router.get("/user/profile", placeholder);
router.put("/user/profile", placeholder);
router.patch("/user/password", placeholder);
router.delete("/user/account", placeholder);

module.exports = router;
