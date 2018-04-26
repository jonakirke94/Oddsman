const express = require("express");
const router = express.Router();
const db = require(".././../db/db");
const msg = require(".././../db/http");
const guard = require('../guards/authguard');

const userController = require('../../controllers/user');

router.post("/signup", userController.user_signup);
router.post("/login", userController.user_login)

module.exports = router;
  