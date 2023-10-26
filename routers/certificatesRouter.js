const express = require("express");
const router = express.Router();
// const router = require("express").Router();
const {
  getCertificatesByUserId,
  postCertificate,
} = require("../controllers/certificatesController");

// middleware
const checkJwt = require("../utils/checkJwt");
const upload = require("../utils/uploadImage");

// const certificatesController = require("../controllers/certificatesController");

router.get("/user-certificates", checkJwt, getCertificatesByUserId);

router.post(
  "/post-certificate",
  checkJwt,
  upload.single("image"),
  postCertificate
);

module.exports = router;
