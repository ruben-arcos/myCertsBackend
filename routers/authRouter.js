const router = require("express").Router();
const {
  createUser,
  allUsers,
  userById,
  login,
  revalidate
} = require("../controllers/authController");
const checkJwt = require("../utils/checkJwt");

router.get("/all-users", allUsers);
router.get("/:userId", userById);
router.post("/sign-up", createUser);
router.post("/login", login);
router.get("/revalidate", checkJwt, revalidate)

module.exports = router;
