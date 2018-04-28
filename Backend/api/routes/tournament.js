const express = require("express");
const router = express.Router();
const db = require(".././../db/db");
const msg = require(".././../db/http");
const adminguard = require('../guards/adminguard');

const tournamentController = require('../../controllers/tournament');

router.post("/", adminguard, tournamentController.test);

module.exports = router;
