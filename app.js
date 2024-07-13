const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.write("Welcome to GET method");
  res.end("Home Page");
});

app.get("/tasks", (req, res) => {
  fs.readFile("task.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500);
      res.write("Error in reading file");
      res.end();
    }
    const response = JSON.parse(data);
    res.json(response.tasks);
  });
});

app.get("/tasks/:id", (req, res) => {
  fs.readFile("task.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500);
      res.write("Error in reading file");
      res.end();
    }
    const response = JSON.parse(data);
    const task = response.tasks.find((t) => t.id === parseInt(req.params.id));
    if (!task) {
      res.status(404);
      res.write("Task not found");
      res.end();
    } else {
      res.json(task);
    }
  });
});

app.post("/tasks", (req, res) => {
  fs.readFile("task.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500);
      res.write("Error in reading file");
      res.end();
    }
    const response = JSON.parse(data);
    const task = req.body;
    //console.log(task);
    const newTask = {
      id: response.tasks.length + 1,
      title: task.title,
      description: task.description,
      completed: task.completed,
    };
    response.tasks.push(newTask);
    fs.writeFile("task.json", JSON.stringify(response), (err) => {
      if (err) {
        res.status(400);
        res.write("Error in writing file");
        res.end();
      } else {
        res.status(201);
        res.json(newTask);
      }
    });
  });
});

app.put("/tasks/:id", (req, res) => {
  const body = req.body;
  fs.readFile("task.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500);
      res.write("Error in reading file");
      res.end();
    }
    const response = JSON.parse(data);
    const task = response.tasks.find((t) => t.id === parseInt(req.params.id));
    if (!task) {
      res.status(404);
      res.write("Task not found");
      res.end();
    } else {
      task.title = body.title;
      task.description = body.description;
      task.completed = body.completed;
      fs.writeFile("task.json", JSON.stringify(response), (err) => {
        if (err) {
          res.status(400);
          res.write("Error in writing file");
          res.end();
        } else {
          res.status(200);
          res.json(task);
        }
      });
    }
  });
});

app.delete("/tasks/:id", (req, res) => {
  fs.readFile("task.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500);
      res.write("Error in reading file");
      res.end();
    }
    const response = JSON.parse(data);
    const deletedTask = response.tasks.find(
      (t) => t.id === parseInt(req.params.id)
    );
    if (!deletedTask) {
      res.status(404);
      res.write("Task not found");
      res.end();
    } else {
      response.tasks = response.tasks.filter(
        (t) => t.id !== parseInt(req.params.id)
      );
      fs.writeFile("task.json", JSON.stringify(response), (err) => {
        if (err) {
          res.status(400);
          res.write("Error in writing file");
          res.end();
        } else {
          res.status(200);
          res.json(deletedTask);
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

module.exports = app;
