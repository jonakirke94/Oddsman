const express = require("express");
const router = express.Router();

const tokenController = require('../../controllers/token');

router.post("/", tokenController.refreshToken);

module.exports = router;
