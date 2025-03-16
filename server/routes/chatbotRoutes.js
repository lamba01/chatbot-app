const express = require("express");
const { chatWithAI } = require("../controllers/chatbotController.js");

const router = express.Router();
router.post("/chat", chatWithAI);

module.exports = router;
