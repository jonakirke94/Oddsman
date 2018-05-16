const express = require("express");
const router = express.Router();
const db = require(".././../db/db");
const msg = require(".././../db/http");
const guard = require('../guards/authguard');
const adminguard = require('../guards/adminguard');

const matchController = require('../../controllers/match');

router.patch("/:matchid", adminguard, matchController.edit_match);
router.get("/missing", adminguard, matchController.get_missing_matches);
router.patch("/result/:resultid", adminguard, matchController.edit_result);
router.get("/result/missing", adminguard, matchController.get_missing_results);

module.exports = router;