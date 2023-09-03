
const express = require('express');
const router = express.Router();
const {getTrainer,insertspecialties,searchTrainerByspecialtie,getAllTrainers,deleteSpecialties,addRatingToTrainer}=require('../controllers/trainerController');
const { authenticateUser, authorizeUser } = require('../middleware/authentication');
//trainer
router.get('/search',authenticateUser, authorizeUser(['trainer','user', 'admin']),searchTrainerByspecialtie);
router.get('/',authenticateUser, authorizeUser(['trainer','user', 'admin']),getAllTrainers);
router.get('/gettrainer/:id', authenticateUser, authorizeUser(['trainer','user']),getTrainer);
router.post('/:id', authenticateUser, authorizeUser(['trainer']),insertspecialties);
router.post('/rating/:id', authenticateUser, authorizeUser(['user']),addRatingToTrainer);
router.delete('/:id', authenticateUser, authorizeUser(['trainer']),deleteSpecialties);


  

module.exports = router;










