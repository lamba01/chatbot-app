import express from "express";
import dotenv from "dotenv";
import cors from "cors";
const chatbotRoutes = require("./routes/chatbotRoutes"); // Import your router

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Chatbot Backend Running...");
});
// Routes
app.use("/api/chatbot", chatbotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
