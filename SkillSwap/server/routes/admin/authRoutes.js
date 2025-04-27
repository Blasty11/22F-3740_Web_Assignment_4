// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {signupAdmin, loginAdmin, signupClient, verifyClient, loginClient} = require('../../controllers/admin/authController');

const {signupFreelancer, loginFreelancer} = require('../../controllers/admin/authController');

// POST /api/auth/admin/signup
router.post('/admin/signup', signupAdmin);

// POST /api/auth/admin/login
router.post('/admin/login', loginAdmin);

// freelancer
router.post('/freelancer/signup', signupFreelancer);
router.post('/freelancer/login',  loginFreelancer);

// Client
router.post('/client/signup', signupClient);
router.post('/client/verify', verifyClient);
router.post('/client/login',  loginClient);

module.exports = router;
