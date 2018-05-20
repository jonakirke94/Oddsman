const express = require("express");
const router = express.Router();

const tokenController = require('../../controllers/token');

router.post("/", tokenController.refresh_token);

module.exports = router;
