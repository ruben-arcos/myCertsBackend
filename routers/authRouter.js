const router = require("express").Router();
const { createUser, allUsers, userById } = require("../controllers/authController");

router.get("/", allUsers)
router.get("/:userId", userById)
router.post("/create-user", createUser);

module.exports = router;
