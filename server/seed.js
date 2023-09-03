require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Trainer = require('./models/trainer');
const TrainingRequest = require('./models/trainingRequest');

const seedUsers = async () => {
  try {
    await User.deleteMany({});
    await Trainer.deleteMany({});
    await TrainingRequest.deleteMany({});

    const mockUsers = [
      {
        firstName: 'Admin',
        lastName: 'Adminson',
        email: 'admin@example.com',
        city: 'Ashdod',
        password: await bcrypt.hash('Admin1234!', 10),
        role: 'admin',
        age: Math.floor(Math.random() * 50) + 20, 
        phone: '0556584771', 
        profilePicture: 'admin.jpg',
      },
      {
        firstName: 'Trainer',
        lastName: 'Trainersson',
        email: 'trainer@example.com',
        city: 'Ashdod',
        password: await bcrypt.hash('Trainer1234!', 10),
        role: 'trainer',
        age: Math.floor(Math.random() * 50) + 20, 
        phone: '0508529661', 
        profilePicture: 'trainer.jpg',
      },
      {
        firstName: 'User',
        lastName: 'Userson',
        email: 'user@example.com',
        city: 'Ashdod',
        password: await bcrypt.hash('User1234!', 10),
        role: 'user',
        age: Math.floor(Math.random() * 50) + 20, 
        phone: '0501111111', 
        profilePicture: 'user.jpg',
      },
    ];
    const createdUsers = await User.create(mockUsers);
    const trainersToCreate = createdUsers.filter(user => user.role === 'trainer');
    const trainersData = trainersToCreate.map(trainerUser => {
      return {
        trainer: trainerUser._id,
        specialties: [], 
      };
    });

    await Trainer.create(trainersData);

    console.log('Mockup users created successfully');
  } catch (error) {
    console.log('Error occurred while seeding Users:', error);
  }

   
    
};
 
const seedAll = async () => {
  // Guard
  const arguments = process.argv;

  if (!arguments.includes('i-am-a-pro')) {
    console.log('WARNING!!');
    console.log('You are about to replace all the data in your database');
    console.log('with mockup / seed data! This operation is irreversible!!');
    console.log(
      'If you know what you are doing, add "i-am-a-pro" argument.'
    );
    process.exit(1);
  }

  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Run the seed functions
  await seedUsers();

  // Finish up
  console.log('Done seeding');
  process.exit(0);
};

seedAll();