const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const TrainingRequest = require("../models/trainingRequest");
const User = require("../models/user");
const Trainer = require("../models/trainer");
const Joi = require("joi");
const moment = require("moment");
//trainee(user)
//-----------------------------------------------------------------------------------------------------
// trainee can see his training requests .
async function getTraineeTrainingsList(req, res) {
  const  traineeId  = req.params.id;
  if (!mongoose.isValidObjectId(traineeId)) {
    return res.status(400).json({ message: 'Invalid trainee ID' });
  }
  
  const trainingRequestList = await TrainingRequest.find({ trainee: traineeId });
  return res.status(200).json({ data: trainingRequestList });
}
//-----------------------------------------------------------------------------------------------------
//trainee can see his training requests by status .
async function getTraineeTrainingListByStatus(req, res) {
  try {
    const traineeId = req.params.id; 
    const status = req.params.status; 

    const trainingRequests = await TrainingRequest.find({
      trainee: traineeId,
      status,
    })
      .populate({
        path: "trainer",
        populate: {
          path: "trainer", 
          select: "firstName lastName",
        },
      })
      .sort({ dateTime: "asc" });

    const formattedTrainings = trainingRequests.map((request) => {
      return {
        trainer: `${request.trainer.trainer.firstName} ${request.trainer.trainer.lastName}`,
        dateTime: request.dateTime.toISOString(),
        status: request.status,
      };
    });

    res.json(formattedTrainings);
  } catch (error) {
    console.error("Error fetching training requests:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching training requests" });
  }
}
//-----------------------------------------------------------------------------------------------------
//trainee creates training request
async function insertTrainingRequest(req, res) {
  const trainerId = req.params.id; 
  const { traineeId, dateTime, status } = req.body;
  const schema = Joi.object({
    traineeId: Joi.string().required(),
    trainerId: Joi.string().required(),
    dateTime: Joi.date().iso().required(),
    status: Joi.string().valid("pending").default("pending"),
  });

  try {
    // Validate the request body against the schema
    const { error } = schema.validate({
      traineeId,
      trainerId,
      dateTime,
      status,
    });

    if (error) {
      return res
        .status(400)
        .json({ message: "Validation error.", details: error.details });
    }

    if (!ObjectId.isValid(traineeId) || !ObjectId.isValid(trainerId)) {
      return res
        .status(400)
        .json({ message: "Invalid traineeId or trainerId." });
    }
    const parsedDateTime = moment(dateTime);

    if (parsedDateTime.isBefore(moment()) || parsedDateTime.minutes() !== 0) {
      return res.status(400).json({ message: "Invalid date and time." });
    }
    const existingApprovedRequest = await TrainingRequest.findOne({
      trainer: trainerId,
      dateTime: new Date(dateTime),
      status: status,
    });
    if (existingApprovedRequest) {
      return res
        .status(400)
        .json({ message: "A similar approved request already exists." });
    }

    // Save the new training request
    const newTrainingRequest = new TrainingRequest({
      trainee: traineeId,
      trainer: trainerId,
      dateTime: new Date(dateTime),
      status: status,
    });

    await newTrainingRequest.save();

    return res
      .status(201)
      .json({ message: "Training request created successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "An error occurred while creating the training request.",
      });
  }
}


//-----------------------------------------------------------------------------------------------------
async function cancelTrainingRequest(req, res) {
  try {
    const requestId = req.params.id;
    const newStatus = req.body.newStatus;

    // Check if the current status is "pending" and the new status is "cancelled"
    if (newStatus !== "cancelled") {
      return res.status(400).json({ message: "Invalid new status." });
    }

    // Find the training request and check if the current status is "pending"
    const existingRequest = await TrainingRequest.findById(requestId);
    if (!existingRequest) {
      return res.status(404).json({ message: "Training request not found." });
    }

    if (existingRequest.status !== "pending") {
      return res.status(400).json({ message: "Cannot cancel a non-pending request." });
    }

    // Update the training request status to "cancelled"
    const updatedRequest = await TrainingRequest.findOneAndUpdate(
      { _id: requestId, status: "pending" }, // Ensure the request is still pending
      { status: newStatus },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Training request not found or already cancelled." });
    }

    res.status(200).json({
      message: `Training request status has been changed to ${newStatus}.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
//trainer
//-----------------------------------------------------------------------------------------------------
async function getTrainerTrainingsList(req, res) {
  const trainerId = req.params.id;
  const trainingRequestList = await TrainingRequest.find({ trainer: trainerId }).exec();
  if (trainingRequestList.length === 0) {
    return res
      .status(200)
      .json({ error: "Could not find a training request list for this user" });
  }
  return res.status(200).json({ data: trainingRequestList });
  
}
//-----------------------------------------------------------------------------------------------------
async function getTrainerTrainingListByStatus(req, res) {
  try {
    const trainerId = req.params.id;
    const status = req.params.status.trim(); 

    // Find training requests where the trainer is the requested trainer and status matches
    const trainings = await TrainingRequest.find({
      trainer: trainerId,
      status: status,
    }).exec();

    if (trainings.length === 0) {
      return res
        .status(204)
        .json({ error: `Could not find a training request list for this trainer by ${status}` });
    }

    res.json(trainings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error` });
  }

}
//-----------------------------------------------------------------------------------------------------
async function changeStatusTrainingRequest(req, res) {
  try {
    const requestId = req.params.id;
    const newStatus = req.body.newStatus; // Assuming you're passing newStatus in the request body
    // Find and update the training request
    const updatedRequest = await TrainingRequest.findOneAndUpdate(
      { _id: requestId },
      { status: newStatus },
      { new: true } // This ensures the updated document is returned
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Training request not found." });
    }
    res.json({
      message: `Training request status has been changed to ${newStatus}.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  insertTrainingRequest,
  getTraineeTrainingsList,
  cancelTrainingRequest,
  getTraineeTrainingListByStatus,
  getTrainerTrainingsList,
  getTrainerTrainingListByStatus,
  changeStatusTrainingRequest,
};
