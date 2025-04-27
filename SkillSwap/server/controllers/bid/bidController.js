// server/controllers/bidController.js
const mongoose = require('mongoose');
const Bid      = require('../../models/Bid');

/**
 * Helper: check for a valid MongoDB ObjectId
 */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

exports.createBid = async (req, res, next) => {
  try {
    const { projectId, amount, message } = req.body;

    // 1) Validate projectId
    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: 'Invalid projectId' });
    }

    // 2) Create
    const bid = await Bid.create({
      projectId,
      freelancerId: req.user.id,
      amount,
      message
    });
    res.status(201).json(bid);
  } catch (err) {
    next(err);
  }
};

exports.updateBid = async (req, res, next) => {
  try {
    const bidId = req.params.id;

    // 1) Validate bidId
    if (!isValidObjectId(bidId)) {
      return res.status(400).json({ message: 'Invalid bid ID' });
    }

    const bid = await Bid.findById(bidId);
    if (!bid) return res.status(404).json({ message: 'Bid not found' });

    // 2) Ownership & status checks
    if (bid.freelancerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (bid.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot edit a bid after decision' });
    }

    // 3) Apply updates
    const { amount, message } = req.body;
    if (amount  !== undefined) bid.amount  = amount;
    if (message !== undefined) bid.message = message;

    await bid.save();
    res.json(bid);
  } catch (err) {
    next(err);
  }
};

exports.getFreelancerBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user.id }).sort('-createdAt');
    res.json(bids);
  } catch (err) {
    next(err);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user.id });
    const count   = bids.length;
    const sum     = bids.reduce((acc, b) => acc + b.amount, 0);
    const average = count ? sum / count : 0;
    const status  = bids.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      count,
      average,
      status: {
        pending:  status.pending  || 0,
        accepted: status.accepted || 0,
        rejected: status.rejected || 0,
      }
    });
  } catch (err) {
    next(err);
  }
};
