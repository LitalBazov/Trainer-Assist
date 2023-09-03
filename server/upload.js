const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require("./models/user");
const { authenticateUser, authorizeUser } = require('./middleware/authentication');

// Define multer storage and upload middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  const fileExtension = file.originalname.split('.').pop().toLowerCase();

  if (file.mimetype.startsWith('image/') && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});
router.get('/user/:id', async function getProfilePicture(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const profilePicture = user.profilePicture;

    if (!profilePicture) {
      return res.status(404).send('Profile picture not found');
    }

    // Serve the profile picture from the "uploads" directory
    return res.sendFile(`${__dirname}/uploads/${profilePicture}`);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Failed to retrieve profile picture');
  }
});

router.put('/user/:id', authenticateUser, authorizeUser(['user', 'trainer','admin']), upload.single('profilePicture'),
async function uploadPhoto(req, res){
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.profilePicture = req.file.filename; // Update the profilePicture field
    await user.save();

    return res.status(200).send('Profile picture updated successfully');
  } catch (error) {
    if (error.message === 'Invalid file type') {
      return res.status(400).send('Invalid file format');
    } else if (error.message === 'File too large') {
      return res.status(400).send('File size exceeds limit');
    }
    console.error(error);
    return res.status(500).send('Failed to update profile picture');
  }
});




module.exports = router;

