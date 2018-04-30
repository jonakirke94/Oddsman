const express = require("express");
const router = express.Router();
const db = require(".././../db/db");
const msg = require(".././../db/http");
const adminguard = require('../guards/adminguard');

const tournamentController = require('../../controllers/tournament');

router.post("/", adminguard, tournamentController.create);
router.get("/", tournamentController.get_all);
//router.get("/:id", tournamentController.);



module.exports = router;
