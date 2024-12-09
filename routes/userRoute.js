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

const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateLoggedUserDataValidator,
  updateLoggedUserPasswordValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");

const authService = require("../controllers/authController");

const router = express.Router();

router.use(authService.protect);

router.get("/getMe", getLoggedUserData);
router.put("/updateMe", updateLoggedUserDataValidator, updateLoggedUserData);
router.put(
  "/changeMyPassword",
  updateLoggedUserPasswordValidator,
  updateLoggedUserPassword
);

router.use(authService.allowedTo("admin"));

router.route("/").get(getUsers).post(createUserValidator, createUser);
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
