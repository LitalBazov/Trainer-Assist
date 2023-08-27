const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const { ObjectId } = mongoose.Types;


const trainerSchema = new mongoose.Schema({
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    specialties: [String], // Array of specialties

  });

  trainerSchema.plugin(mongoosePaginate);


  const Trainer = mongoose.model('Trainer', trainerSchema);
  module.exports = Trainer;

