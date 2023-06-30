const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3000;
var jwt = require("jsonwebtoken");
const db = new sqlite3.Database("list.db", (err) => {
  if (err) {
    console.error("Failed to connect to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.use(express.json());

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  db.all(
    "SELECT * FROM records AS r JOIN todos AS t  ON t.id = r.t_id WHERE r.u_id = ?",
    [id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.json(rows);
      }
    }
  );
});

app.post("/todos/create/:id", express.json(), (req, res) => {
  const u_id = req.params.id;
  const desc = req.body.desc;

  db.run(
    "INSERT INTO todos (  desc, isChecked) VALUES (?, ?)",
    [desc, false],
    function (err) {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
      } else {
        const t_id = this.lastID;

        db.run(
          "INSERT INTO records (u_id, t_id) VALUES (?, ?)",
          [u_id, t_id],
          (err) => {
            if (err) {
              console.err(err);
              res.status(500).send("Internal server error when inserting");
            } else {
              res.json({ t_id: t_id });
            }
          }
        );
      }
    }
  );
});

app.post("/todos/:index", express.json(), (req, res) => {
  const index = req.params.index;
  const isChecked = req.body.isChecked;

  db.run(
    "UPDATE todos SET isChecked = ? WHERE id = ?",
    [isChecked, index],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
      } else {
        res.send("Todo updated successfully");
      }
    }
  );
});

app.post("/todos/update/:index", express.json(), (req, res) => {
  const index = req.params.index;
  const desc = req.body.desc;
  const isChecked = req.body.isChecked;

  db.run(
    "UPDATE todos SET desc = ?, isChecked = ? WHERE id = ?",
    [desc, isChecked, index],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
      } else {
        res.send("Todo updated successfully");
      }
    }
  );
});

app.post("/register", express.json(), (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Check if user exists
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    } else if (user) {
      // User already exists
      res.status(409).send("User already exists");
    } else {
      // User does not exist, proceed to register the user
      db.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, password],
        (err) => {
          if (err) {
            console.log(err);
            res.status(500).send("Internal server error");
          } else {
            res.send("User successfully created");
          }
        }
      );
    }
  });
});

app.post("/login", express.json(), (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  db.get(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) {
        res.status(500).send("Internal server error");
      } else {
        if (row) {
          const token = jwt.sign(
            {
              userId: row.id,
              username: email,
              password: password,
            },
            "secret",
            {
              expiresIn: "1h",
            }
          );

          res.json({ token: token, userId: row.id });
        } else {
          res.status(401).send("Invalid username or password");
        }
      }
    }
  );
});

app.delete("/todos/:index", express.json(), (req, res) => {
  const index = req.params.index;

  db.run("DELETE FROM records WHERE t_id = ? ", [index], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    } else {
      res.send("Todo item deleted successfully");
    }
  });
});
