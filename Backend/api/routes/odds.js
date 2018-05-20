const express = require("express");
const router = express.Router();
const guard = require('../guards/authguard');

const oddsController = require('../../controllers/odds');

router.post("/:tourid", guard, oddsController.send_odds);
router.get("/recent", oddsController.get_recent_bets_http);

module.exports = router;