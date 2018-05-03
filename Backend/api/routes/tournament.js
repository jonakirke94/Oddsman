const express = require("express");
const router = express.Router();
const db = require(".././../db/db");
const msg = require(".././../db/http");
const adminguard = require('../guards/adminguard');
const guard = require('../guards/authguard');

const tournamentController = require('../../controllers/tournament');

router.post("/", adminguard, tournamentController.create);
router.post("/:tourid/requests/:userid", adminguard, tournamentController.handle_request);
router.post("/:tourid/requests/", guard, tournamentController.request)
router.get("/requests/", guard, tournamentController.get_users_requests)
router.get("/requests/:tourid", adminguard, tournamentController.get_tournament_requests)
router.get("/enrolled", guard, tournamentController.get_enrolled_tournaments)
router.get("/unenrolled/", guard, tournamentController.get_unenrolled_tournaments)
router.get("/:tourid/participants/", tournamentController.get_participants)




router.get("/", tournamentController.get_all);
//router.get("/:id", tournamentController.);



module.exports = router;
