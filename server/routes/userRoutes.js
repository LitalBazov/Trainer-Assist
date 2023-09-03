const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser, updateUserbyuser,getUserProfile } = require('../controllers/userController');
const { authenticateUser, authorizeUser } = require('../middleware/authentication');

router.get('/admin', authenticateUser, authorizeUser(['admin']), getAllUsers);
router.get('/admin/:id', authenticateUser, authorizeUser(['admin']), getUserById);
router.get('/:id', authenticateUser, authorizeUser(['user','trainer','admin']), getUserProfile);
router.post('/admin', authenticateUser, authorizeUser(['admin']), createUser);
router.put('/admin/:id', authenticateUser, authorizeUser(['admin']), updateUser);
router.put('/:id', authenticateUser, authorizeUser(['user','trainer','admin']), updateUserbyuser);
router.delete('/admin/:id', authenticateUser, authorizeUser(['admin']), deleteUser);

module.exports = router;