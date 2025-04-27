// server/routes/bidRoutes.js
const express = require('express');
const router  = express.Router();
const {
  createBid,
  updateBid,
  getFreelancerBids,
  getAnalytics
} = require('../../controllers/bid/bidController');
const { protectFreelancer } = require('../../middleware/authMiddleware');

router.post(
  '/freelancer/bids',
  protectFreelancer,
  createBid
);

router.put(
  '/freelancer/bids/:id',
  protectFreelancer,
  updateBid
);

router.get(
  '/freelancer/bids',
  protectFreelancer,
  getFreelancerBids
);

router.get(
  '/freelancer/bids/analytics',
  protectFreelancer,
  getAnalytics
);

module.exports = router;
