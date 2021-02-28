var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
//Model
const UserModel = require('../models/User')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;