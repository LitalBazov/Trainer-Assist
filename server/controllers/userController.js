const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Trainer = require("../models/trainer");

// Get all users (with pagination)
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 25 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      select: "-password",
    };

    const users = await User.paginate({}, options);

    const usersFixed = { ...users };
    usersFixed.data = usersFixed.docs;
    delete usersFixed.docs;

    return res.status(200).json(usersFixed);
  } catch (error) {
    next(error);
  }
};
const getUserById= async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};
//----------------------------------------------------------------------------------------------
// Get a user by ID
const getUserProfile= async (req, res, next) => {
  const traineeId = req.params.id
  try {
    const user = await User.findById(traineeId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};
//----------------------------------------------------------------------------------------------
const createUser = async (req, res, next) => {
  // Validation schema for creating a new user
  const {firstName,lastName,password,age,phone,email,city,role} = req.body;

  const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().min(5).required(),
    age: Joi.number().integer().min(16).required(),
    phone: Joi.string().pattern(/^[+]?\d{10,}$/).required(),
    email: Joi.string().email().required(),
    city: Joi.string().optional(),
    role: Joi.string().default("user").valid('admin', 'trainer', 'user'),
    profilePicture: Joi.string().allow('').optional(),

  });

  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const found = await User.findOne({email} );

    if (found) {
      return res.status(400).json({ error: "This email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({firstName,lastName,password:hashedPassword,age,phone,email,city,role});
       // Create the trainer in database
       if(role==="trainer"){
        const newTrainer = await Trainer.create({trainer: user._id});
      }
    return res.status(201).json({ created: user });
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------


const updateUser = async (req, res, next) => {
  // Validation schema for updating an existing user
  const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    age: Joi.number().integer().min(16).required(),
    phone: Joi.string().pattern(/^[+]?\d{8,}$/).required(),
    email: Joi.string().email().required(),
    city: Joi.string().optional(),
    role: Joi.string().default("user").valid('admin', 'trainer', 'user'),

  });

  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { firstName, lastName, age, phone, email, city, role} = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, age, phone, email, city, role},
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (role === "trainer") {
      const newTrainer = await Trainer.create({ trainer: updatedUser._id });
    }
    if (updatedUser.role === "user") {
      await Trainer.findOneAndRemove({ trainer: updatedUser._id });
    }

    return res.status(200).json({ updated: updatedUser });

  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------------------------------

const updateUserbyuser = async (req, res, next) => {
  const { firstName, lastName, password, age, phone, email, city, role } = req.body;
  // Validation schema for updating an existing user
  const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    age: Joi.number().integer().min(16).required(),
    phone: Joi.string().pattern(/^[+]?\d{8,}$/).required(),
    email: Joi.string().email().required(),
    city: Joi.string().optional(),
    role: Joi.string().default("user").valid('trainer', 'user'),
  });

  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Ensure valid role
  if (["user", "trainer"].indexOf(req.body.role) === -1) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    // Find the user by ID
    const userId = req.params.id;
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: req.body }, // Update with the request body
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ updated: updatedUser });
  } catch (error) {
    next(error);
  }
};
//----------------------------------------------------------------------------------------------

// Delete use by id
const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndRemove(req.params.id).select('-password');

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
        // If the deleted user had the role "trainer", delete the associated trainer entry
        if (deletedUser.role === "trainer") {
          await Trainer.findOneAndRemove({ trainer: deletedUser._id });
        }
      

    return res.status(200).json({ deleted: deletedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserbyuser,
  getUserProfile
};
