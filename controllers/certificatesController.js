const db = require("../utils/db");

const getCertificatesByUserId = (req, res) => {
  const { id } = req.user_credentials;
  const sql = `
    SELECT * FROM ??
    WHERE ?? = ?
  `;
  const body = ["certificates", "user_id", id];
  db.query(sql, body, (error, rows) => {
    if (error) {
      return res.json({ error });
    }
    res.json(rows);
  });
};

module.exports = {
  getCertificatesByUserId,
};
