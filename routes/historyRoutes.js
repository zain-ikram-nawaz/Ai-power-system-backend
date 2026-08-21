const express = require("express");
const { getHistory, deleteHistoryItem, deleteAllHistory } = require("../controllers/historyController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getHistory);
router.delete("/:id", protect, deleteHistoryItem);
router.delete("/", protect, deleteAllHistory);

module.exports = router;
