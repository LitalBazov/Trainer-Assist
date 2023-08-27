const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const { ObjectId } = mongoose.Types;

const trainingRequestSchema = new mongoose.Schema({
  trainee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer'},
  dateTime: Date,
  status: { type: String, enum: ['pending', 'approved', 'disapproved','cancelled'], default: 'pending' },
 
});

trainingRequestSchema.plugin(mongoosePaginate);

const TrainingRequest = mongoose.model('trainingRequest', trainingRequestSchema);

module.exports = TrainingRequest; 

