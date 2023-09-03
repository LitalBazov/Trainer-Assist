const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const TrainingRequest = require('../models/trainingRequest'); 
const express = require('express');
const app = express();
const Trainer = require('../models/trainer'); 
const User = require('../models/user');
//-----------------------------------------------------------------------------------------------------
async function getTrainer(req, res) {
  try {
    const trainerId = req.params.id;
    const trainer = await Trainer.findOne({ trainer: trainerId }).select('-password').populate('trainer');
    
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.status(200).json(trainer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error3' });
  }
};
//-----------------------------------------------------------------------------------------------------
async function insertspecialties(req, res) {
    try {
      const trainerId = req.params.id;
      const specialties = req.body.specialties; 
  
      if (trainerId !== req.params.id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    trainer.specialties.push(...specialties); // Add specialties to the array
    await trainer.save(); // Save the updated trainer

    res.status(201).json({ message: 'Specialties added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
  };
  async function addRatingToTrainer(req, res) {
    try {
      const trainerId = req.params.id;
      const  userId  = req.body.traineeId;
      const ratingValue = req.body.rating
      if (trainerId !== req.params.id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      const trainer = await Trainer.findById(trainerId);
      if (!trainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }
      const existingRating = trainer.ratings.find(rating => rating.user.toString() === userId);
      if (existingRating) {
        return res.status(304).json({ message: 'User has already rated this trainer' });
      }
      // Create a new rating object
      const newRating = {
        user: userId,
        rating: ratingValue,
      };
  
      trainer.ratings.push(newRating);
      // Calculate accumulatedRating
      const totalAccumulatedRating = trainer.ratings.reduce((sum, r) => sum + r.rating, 0);
      trainer.averageRating = totalAccumulatedRating / trainer.ratings.length;
      trainer.accumulatedRating = totalAccumulatedRating; // Update accumulatedRating
      await trainer.save();
  
      res.status(201).json({ message: 'Rating added successfully' });
    } catch (error) {
     // console.error(error);
      res.status(500).json({ message: 'Failed to add rating' });
    }
  }
  
  //-----------------------------------------------------------------------------------------------------

  async function deleteSpecialties(req, res) {
    try {
      const trainerId = req.params.id;
      const specialtiesToDelete = req.body.specialties;
      if (trainerId !== req.params.id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      const trainer = await Trainer.findById(trainerId);
  
      if (!trainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }
  
      // Remove specialties from the array
      trainer.specialties = trainer.specialties.filter(
        specialty => !specialtiesToDelete.includes(specialty)
      );
  
      await trainer.save(); // Save the updated trainer
  
      res.status(200).json({ message: 'Specialties deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
//-----------------------------------------------------------------------------------------------------
async function searchTrainerByspecialtie(req, res){
  try {
      const searchQuery = req.query.specialty; 
      // Get trainers with the specified specialty
      const trainers = await Trainer.find({ specialties: {$in: [searchQuery]} })
      res.json(trainers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error2' });
    }
};
//-----------------------------------------------------------------------------------------------------

async function getAllTrainers(req, res, next) {
  try {
    const { page = 1, limit = 25 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const trainers = await Trainer.paginate({}, options);
    const trainerIds = trainers.docs.map(trainer => trainer.trainer);
    const users = await User.find({ _id: { $in: trainerIds } });
    const trainersWithUserDetails = trainers.docs.map(trainer => {
      const user = users.find(user => user._id.equals(trainer.trainer));
      
      if (!user) {
        // Handle the case where a corresponding user is not found
        return {
          ...trainer.toObject(),
          trainer: null, // or an appropriate default value
        };
      }
    
      const { id, firstName, lastName, age, phone, email, city, profilePicture } = user;
    
      return {
        ...trainer.toObject(),
        trainer: {
          id,
          firstName,
          lastName,
          age,
          phone,
          email,
          city,
          profilePicture,
        },
      };
    });
    
    const trainersFixed = { ...trainers };
    trainersFixed.data = trainersWithUserDetails;
    delete trainersFixed.docs;

    return res.status(200).json(trainersFixed);
  } catch (error) {
    next(error);
  }
}


module.exports={getTrainer, insertspecialties,searchTrainerByspecialtie,getAllTrainers,deleteSpecialties,addRatingToTrainer };