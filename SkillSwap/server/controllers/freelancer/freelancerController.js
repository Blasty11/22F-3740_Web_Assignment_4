// server/controllers/freelancerController.js
const Freelancer = require('../../models/Freelancer');

exports.getProfile = async (req, res, next) => {
  try {
    const freelancer = await Freelancer.findById(req.user.id);
    if (!freelancer) return res.status(404).json({ message: 'Not found' });
    res.json(freelancer);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, skills, portfolio } = req.body;
    // 1) Load the document
    const freelancer = await Freelancer.findById(req.user.id);
    if (!freelancer) return res.status(404).json({ message: 'Not found' });

    // 2) Apply text updates
    if (name)      freelancer.name = name;
    if (skills)    freelancer.skills = skills
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean);
    if (portfolio) freelancer.portfolio = portfolio
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean);

    // 3) Append any uploaded docs
    if (req.files && req.files.length) {
      const paths = req.files.map(f => `/uploads/docs/${f.filename}`);
      freelancer.docs.push(...paths);
    }

    // 4) Save & return
    await freelancer.save();
    res.json(freelancer);
  } catch (err) {
    next(err);
  }
};

exports.searchFreelancers = async (req, res, next) => {
  try {
    const { name, skills, level } = req.query;
    const filter = { verified: true };

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (level) {
      filter.verificationLevel = level;
    }
    if (skills) {
      const arr = skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      filter.skills = { $in: arr };
    }

    const list = await Freelancer.find(filter);
    res.json(list);
  } catch (err) {
    next(err);
  }
};