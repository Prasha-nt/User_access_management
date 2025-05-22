const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.post('/', auth, checkRole(['Employee','Admin']), requestController.createRequest);
router.patch('/:id', auth, checkRole(['Manager','Admin']), requestController.updateRequest);
router.get('/my-requests', auth, checkRole(['Employee','Admin','Manager']), requestController.getMyRequests);
router.get('/', requestController.getAllRequests);


module.exports = router;
