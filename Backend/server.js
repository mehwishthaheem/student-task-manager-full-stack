require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Task Schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model("Task", taskSchema);

// Home Route
app.get("/", (req, res) => {
  res.send("Backend Working With MongoDB");
});

// Get All Tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// Add Task
app.post("/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and Description Required"
      });
    }

    const task = await Task.create({
      title,
      description
    });

    res.status(201).json({
      message: "Task Added",
      task
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding task" });
  }
});

// Update Task
app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found"
      });
    }

    res.json({
      message: "Task Updated",
      task
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// Delete Task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found"
      });
    }

    res.json({
      message: "Task Deleted"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

app.listen(process.env.PORT || 7000, () => {
  console.log(`Server Running On Port ${process.env.PORT || 7000}`);
});