const express = require("express");
const router = express.Router();
const db = require('../db/db');
const msg = require("../db/http");
const mysql = require('mysql');

exports.sendOdds = (req, res, next) => {
 
    return msg.show200(req,res,next);

}