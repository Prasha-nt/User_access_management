const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth');


router.post('/signup', authController.register);  // Use /signup as per your spec
router.post('/login', authController.login);


module.exports = router;
