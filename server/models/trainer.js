const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const { ObjectId } = mongoose.Types;


const trainerSchema = new mongoose.Schema({
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    specialties: [String],
    ratings: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
    }],
    accumulatedRating: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 }

    

  });

  trainerSchema.plugin(mongoosePaginate);


  const Trainer = mongoose.model('Trainer', trainerSchema);
  module.exports = Trainer;

