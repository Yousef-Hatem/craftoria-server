const express = require("express");

const {
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  changeUserPassword,
} = require("../controllers/userController");

const authService = require("../controllers/authController");

const router = express.Router();

router.use(authService.protect);

router.get("/getMe", getLoggedUserData);
router.put("/updateMe", updateLoggedUserData);
router.put("/changeMyPassword", updateLoggedUserPassword);

router.use(authService.allowedTo("admin"));

router.route("/").get(getUsers).post(createUser);
router.put("/changePassword/:id", changeUserPassword);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
