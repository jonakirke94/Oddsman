const express = require("express");
const router = express.Router();
const db = require(".././../db/db");
const msg = require(".././../db/http");

const userController = require('../controllers/user');

router.post("/signup", userController.user_signup);

module.exports = router;
