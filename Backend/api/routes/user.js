const express = require("express");
const router = express.Router();
const db = require(".././../db/db");
const msg = require(".././../db/http");

const userController = require('../controllers/user');

router.get("/signup", userController.user_signup);
router.get("/all", userController.get_all);
router.post("/", userController.create);

module.exports = router;
