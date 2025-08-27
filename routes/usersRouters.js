const express = require('express');
const router = express.Router();
const { loginuser,registeruser,logoutuser } = require('../controllers/authcontroller');
router.post('/register', registeruser)
router.post('/login',loginuser);
router.get('/logout', logoutuser);
module.exports = router;