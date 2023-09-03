const bcrypt = require("bcrypt");
const Joi = require("joi");
const User = require("../models/user");
const Trainer = require("../models/trainer");


const { generateToken } = require("../config/jwt");
const { AUTH_MAX_AGE } = process.env;

const signUp = async (req, res) => {

  const { firstName, lastName, password, age, phone, email, city, role, profilePicture } = req.body;

  const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().min(5).required(),
    age: Joi.number().integer().min(16).required(),
    phone: Joi.string().pattern(/^[+]?\d{8,}$/).required(),
    email: Joi.string().email().required(),
    city: Joi.string().optional(),
    role: Joi.string().valid('user', 'trainer').required(),
    profilePicture: Joi.string().allow('').optional(),

  });
  // Validate request body
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  // Ensure valid role
  if (["user", "trainer"].indexOf(req.body.role) === -1) {
    return res.status(400).json({ error: "Invalid role" });
  }  

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
   
    const hashedPassword = await bcrypt.hash(password, 10);

    
    // Create the user in database
    const newUser = await User.create({
      firstName,
      lastName,
      password:hashedPassword,
      age,
      phone,
      email,
      city,
      role,
      profilePicture
    });
   

    // Create the trainer in database
    if(role==="trainer"){
      const newTrainer = await Trainer.create({trainer: newUser._id});
    }
   
    
    const payload = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      age:newUser.age,
      city:newUser.city,
      phone:newUser.phone,
      role: newUser.role,
      profilePicture: newUser.profilePicture,
  
    };
    
    const token = await generateToken(payload);


    
    res.cookie("token", token, {
      httpOnly: false,
      maxAge: AUTH_MAX_AGE,
    });

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(400).json({ error1: error.message });
  }
};
//----------------------------------------------------------------------------
const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Check if user exists in db

    const user = await User.findOne({ email });

    // this email does not exist
    if (!user) {
      return res.status(401).json({ error: `Invalid email` });
    }

    // 2. Compare passwords

    const isMatch = await bcrypt.compare(password, user.password);

    // the password is incorrect
    if (!isMatch) {
      return res.status(401).json({ error:  `Invalid password ` });
    }

    // 3. Generate and send token

    // create the payload object
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      age:user.age,
      city:user.city,
      phone:user.phone,
      role: user.role,
      profilePicture: user.profilePicture,
    };

    // wrap the payload inside a jwt token
    const token = await generateToken(payload);

    // send a cookie containing the token
    res.cookie("token", token, {
      httpOnly: false,
      maxAge: AUTH_MAX_AGE,
    });

    res.status(200).json(payload);
  } catch (error) {
    res.status(400).json({ error: "Cannot sign you in" });
  }
};

const signOut = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Signed out successfully" });
};

module.exports = { signUp, signIn, signOut };
