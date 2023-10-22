const router = require("express").Router();
const { createUser, allUsers, userById, login} = require("../controllers/authController");

router.get("/", allUsers)
router.get("/:userId", userById)
router.post("/create-user", createUser);
router.post("/login", login)

module.exports = router;
