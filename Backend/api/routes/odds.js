const express = require("express");
const router = express.Router();
const db = require(".././../db/db");
const msg = require(".././../db/http");
const guard = require('../guards/authguard');

const oddsController = require('../../controllers/odds');

router.post("/:tourid", guard, oddsController.sendOdds);

module.exports = router;