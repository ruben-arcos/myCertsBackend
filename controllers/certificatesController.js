const db = require("../utils/db");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
// this connects to AWS s3 bucket
const s3 = require("../utils/s3");
const crypto = require("crypto");
// const sharp = require("sharp");

const bucketName = process.env.BUCKET_NAME;

const getCertificatesByUserId = (req, res) => {
  // Extract user ID from the request
  const { id } = req.user_credentials;
  // Define a SQL query to retrieve certificates for a specific user
  const sql = `
    SELECT * FROM ??
    WHERE ?? = ?
  `;
  // Create an array with the table name and query parameters
  const body = ["certificates", "user_id", id];
  // Execute the database query
  db.query(sql, body, (error, rows) => {
    // If there's an error, return an error response
    if (error) {
      return res.json({ error });
    }
    // Otherwise, return the retrieved rows as a JSON response
    res.json(rows);
  });
};

// uploading images function and posting to sql
// this function will upload image to S3 Bucket, if succesful, will send back imageURL, then save the image reference along with certificate details (body) to mysql DB.
const postCertificate = async (req, res) => {
  // Generate a random image name
  const randomImageName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");
  const imageName = randomImageName();
  // Log the uploaded file and the request body
  console.log(req.file);
  console.log(req.body);

  // to resize image
  //   const buffer = await sharp(req.file.buffer)
  //     .resize({ height: 1920, width: 1080, fit: "contain" })
  //     .toBuffer();

  // Define S3 parameters for uploading the image
  const params = {
    Bucket: bucketName,
    Key: imageName,
    // Body: buffer,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  // Create a command to upload the image to S3
  const command = new PutObjectCommand(params);
  // Send the command to upload the image to S3
  await s3.send(command);

  // Define a SQL query to insert certificate details into the database
  const sql = `
  INSERT INTO certificates(user_id, image_name, certification_name, expiration_date, place_of_certification) 
  VALUES (?, ?, ?, ?, ?)
  `;

  // Create an array with the values for the SQL query
  const body = [
    req.user_credentials.id,
    imageName,
    req.body.certification_name,
    req.body.expiration_date,
    req.body.place_of_certification,
  ];

  // Execute the database query
  db.query(sql, body, (error, results) => {
    // If there's an error, return an error response
    if (error) {
      return res.json({ error });
    }
     // Otherwise, return a success message and the query results as a JSON response
    res.json({ msg: "Hello!", results });
  });
};

// Export the functions as modules for use in other parts of the application
module.exports = {
  getCertificatesByUserId,
  postCertificate,
};
