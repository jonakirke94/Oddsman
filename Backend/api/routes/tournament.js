const express = require("express");
const router = express.Router();
const db = require(".././../db/db");
const msg = require(".././../db/http");
const adminguard = require('../guards/adminguard');
const guard = require('../guards/authguard');

const tournamentController = require('../../controllers/tournament');

router.post("/",  adminguard,  tournamentController.create);
router.post("/:tourid/requests/:userid", adminguard, tournamentController.manage_request);
router.post("/:tourid/requests/", guard, tournamentController.request)
router.get("/requests/", guard, tournamentController.get_users_requests)
router.get("/requests/:tourid", adminguard, tournamentController.get_tournament_requests)
router.get("/enlisted", guard, tournamentController.get_enlisted_tournaments)
router.get("/delisted/", guard, tournamentController.get_delisted_tournaments)
router.get("/", tournamentController.get_all);
//router.get("/:tourid/participants/", tournamentController.get_participants)
//router.get("/:id", tournamentController.);



module.exports = router;
