const express = require('express');
const router = express.Router();
const softwareController = require('../controllers/software.controller');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.post('/', auth, checkRole(['Admin']), softwareController.createSoftware);


router.get('/',auth,checkRole(['Manager','Admin','Employee']), softwareController.getAllSoftware);


module.exports = router;
