const express = require("express");
const router = express.Router();
const adminguard = require('../guards/adminguard');
const guard = require('../guards/authguard');

const tournamentController = require('../../controllers/tournament');

router.get("/requests/", guard, tournamentController.get_users_requests)
router.get("/requests/:tourid", adminguard, tournamentController.get_tournament_requests)
router.get("/enlisted", guard, tournamentController.get_enlisted_tournaments)
router.get("/delisted/", guard, tournamentController.get_delisted_tournaments)
router.get("/", tournamentController.get_all);
router.get("/current/user", guard, tournamentController.get_current_tournament_user) //get a user's current tournament if any
router.get('/current', tournamentController.get_current_tournament) //get the tournament that is currently ongoing
router.get("/:tourid/overview", tournamentController.get_overview)

router.post("/", adminguard, tournamentController.create);
router.post("/:tourid/requests/:userid", adminguard, tournamentController.manage_request);
router.post("/:tourid/requests/", guard, tournamentController.request)


module.exports = router;