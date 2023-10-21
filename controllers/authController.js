const db = require("../utils/db");
const argon2 = require("argon2");

const allUsers = (req, res) => {
    const sql = "SELECT * FROM users"
    db.query(sql, (error, rows) => {
        res.json({ rows })
    })
}

const userById = (req, res) => {
    const sql = "SELECT * FROM users WHERE user_id = ?"
    const { userId } = req.params
    const body = [userId]

    db.query(sql, body, (error, rows) => {
        res.json({ rows })
    })
}

const createUser = async (req, res) => {
  console.log("inside /create-user route");
  if (!req.body) {
    return res.status(400).json({ msg: "User info is required." });
  }
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
      return res.json({
        msg: "Email already exists, try logging in.",
        error,
      });
    }
    if (error) {
      return res.json({
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

module.exports = { createUser, allUsers, userById };
