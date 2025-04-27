const express = require('express');
const router  = express.Router();
const path    = require('path');
const multer  = require('multer');

const {
  getProfile,
  updateProfile,
  searchFreelancers       // ← NEW
} = require('../../controllers/freelancer/freelancerController');

const {
  protectFreelancer,
  protectClient           // ← ensure import
} = require('../../middleware/authMiddleware');

// Multer setup (absolute path)
const docsPath = path.join(__dirname, '..', 'uploads', 'docs');
const storage  = multer.diskStorage({
  destination: (req, file, cb) => cb(null, docsPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});
const upload = multer({ storage });

// Client-facing search (only verified tutors)
router.get(
  '/freelancers',
  protectClient,
  searchFreelancers
);

// Protected freelancer profile
router.get(
  '/freelancer/profile',
  protectFreelancer,
  getProfile
);
router.put(
  '/freelancer/profile',
  protectFreelancer,
  upload.array('docs', 5),
  updateProfile
);

module.exports = router;
