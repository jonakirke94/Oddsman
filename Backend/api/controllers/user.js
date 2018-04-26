const express = require("express");
const router = express.Router();
const db = require("../../db/db");
const msg = require("../../db/http");

const baseUrl = 'http://localhost:4200/';


exports.user_signup = (req, res, next) => {
    msg.show200(req,res,next);
}