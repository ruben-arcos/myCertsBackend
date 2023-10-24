const router = require("express").Router();
const { getCertificatesByUserId } = require("../controllers/certificatesController");
const checkJwt = require("../utils/checkJwt");

router.get('/user-certificates', checkJwt, getCertificatesByUserId)

module.exports = router;
