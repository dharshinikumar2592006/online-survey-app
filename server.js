
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Survey Schema
const surveySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    question1: String,
    question2: String,
    question3: String,
    question4: String
  },
  { timestamps: true }
);

const Survey = mongoose.model("Survey", surveySchema);

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Save survey response
app.post("/api/surveys", async (req, res) => {
  try {
    const { name, question1, question2, question3, question4 } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Please enter your name."
      });
    }

    const survey = await Survey.create({
      name,
      question1,
      question2,
      question3,
      question4
    });

    res.status(201).json({
      message: "Survey submitted successfully!",
      survey
    });
  } catch (error) {
    console.error("Survey save error:", error.message);
    res.status(500).json({
      message: "Could not save survey response."
    });
  }
});

// View saved survey responses
app.get("/api/surveys", async (req, res) => {
  try {
    const surveys = await Survey.find().sort({ createdAt: -1 });
    res.json(surveys);
  } catch (error) {
    console.error("Survey fetch error:", error.message);
    res.status(500).json({
      message: "Could not fetch survey responses."
    });
  }
});

// Connect to MongoDB first, then start server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI missing. Check your .env file.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();
