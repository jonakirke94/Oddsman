const express = require("express");
const router = express.Router();
const db = require(".././../db/db");
const msg = require(".././../db/http");
const guard = require('../guards/authguard');
const adminguard = require('../guards/adminguard');

const userController = require('../../controllers/user');

router.post("/signup", userController.user_signup);
router.post("/login", userController.user_login);
router.get("/", adminguard, userController.user_all);
router.get("/bets/:tourid", guard, userController.bets);
router.patch("/", guard, userController.update);

module.exports = router;