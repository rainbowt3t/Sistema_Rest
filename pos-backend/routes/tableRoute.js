const express = require("express");
const { addTable, getTables, updateTable, updateTableDetails, deleteTable } = require("../controllers/tableController");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification")
const { isAdmin } = require("../middlewares/adminAuthorization");
 
router.route("/").post(isVerifiedUser, isAdmin, addTable);
router.route("/").get(isVerifiedUser, getTables);
router.route("/:id").put(isVerifiedUser, updateTable);
router.route("/detail/:id").put(isVerifiedUser, isAdmin, updateTableDetails);
router.route("/:id").delete(isVerifiedUser, isAdmin, deleteTable);

module.exports = router;