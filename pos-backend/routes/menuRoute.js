const express = require("express");
const { createMenuItem, getMenuItems, updateMenuItem, deleteMenuItem } = require("../controllers/menuController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { isAdmin } = require("../middlewares/adminAuthorization");
const router = express.Router();

router.route("/").get(isVerifiedUser, getMenuItems);
router.route("/").post(isVerifiedUser, isAdmin, createMenuItem);
router.route("/:id").put(isVerifiedUser, isAdmin, updateMenuItem);
router.route("/:id").delete(isVerifiedUser, isAdmin, deleteMenuItem);

module.exports = router;
