const db = require("../utils/db");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const allUsers = (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (error, rows) => {
    res.json({ rows });
  });
};

const userById = (req, res) => {
  const sql = "SELECT * FROM users WHERE user_id = ?";
  const { userId } = req.params;
  const body = [userId];

  db.query(sql, body, (error, rows) => {
    res.json({ rows });
  });
};

const createUser = async (req, res) => {
  console.log("inside /create-user route");
  if (!req.body) {
    return res.status(400).json({ msg: "User info is required." });
  }
  // must match with front end at signUp.js  body: JSON.stringify
  const { firstName, lastName, email, password, promos } = req.body;
  const sql = `
            INSERT INTO users (first_name, last_name, email, password, promos)
            VALUES (?, ?, ?, ?, ?);
        `;

  let hash;
  try {
    hash = await argon2.hash(password);
    console.log(hash);
  } catch (error) {
    return res.json({ msg: "unexpected error", error });
  }

  const body = [firstName, lastName, email, hash, promos];

  db.query(sql, body, (error, results) => {
    if (error && error.errno === 1062) {
      return res.status(401).json({
        msg: "Email already exists, try logging in.",
        error,
      });
    }
    if (error) {
      return res.status(401).json({
        msg: "Problem creating account.",
        error,
      });
    }
    return res.json({
      msg: "success creating account",
      user_id: results.insertId,
      results,
    });
  });
};

const login = (req, res) => {
  console.log("inside login route");
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);

  const sql = `
    SELECT * FROM users 
    WHERE email = ?;
  `;
  // no password inside query, since it won't match the hash password
  // argon2 will validate password and hash  password match
  const body = [email];
  db.query(sql, body, async (error, rows) => {
    if (error) {
      return res.json({ error });
    }
    // handling if user exist with email
    if (rows.length === 0) {
      return res.status(401).json({
        msg: "Username does not exist. Please create account.",
      });
    }
    const hash = rows[0].password;
    let match;
    try {
      match = await argon2.verify(hash, password);
    } catch (error) {
      console.log(error);
    }
    // handling if password doesn't match
    console.log(match, "match");
    if (!match) {
      // keep msg ambiguous
      return res.status(401).json({
        msg: "Username or password is incorrect. Please try again",
      });
    }
    // user exists with matching password
    // user authorized, sending auth token using jwt
    // creating object with key/values
    console.log(rows[0]);
    const unsignedToken = {
      id: rows[0].user_id,
      email: rows[0].email,
      // value coming from mysql database
      firstName: rows[0].first_name,
      lastName: rows[0].last_name,
    };
    //
    const token = jwt.sign(unsignedToken, process.env.JWT_SECRET);
    return res.json({
      msg: "login successful",
      token,
      user: unsignedToken,
    });
  });
};

const revalidate = (req, res) => {
  console.log("revalidate", req.user_credentials);
  res.json(req.user_credentials);
};

module.exports = { createUser, allUsers, userById, login, revalidate };
