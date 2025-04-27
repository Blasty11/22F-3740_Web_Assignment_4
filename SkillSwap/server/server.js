// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { mongoURI, port } = require('./utils/config');

const authRoutes = require('./routes/admin/authRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');
const freelancerRoutes = require('./routes/freelancer/freelancerRoutes');
const projectRoutes = require('./routes/bid/projectRoutes');
const bidRoutes = require('./routes/bid/bidRoutes');
const { protectAdmin } = require('./middleware/authMiddleware');

const app = express();

// ——— Ensure upload directories exist ———
const uploadRoot = path.join(__dirname, 'uploads');
const docsDir = path.join(uploadRoot, 'docs');
fs.mkdirSync(docsDir, { recursive: true });

// ——— Middlewares ———
app.use(cors());
app.use(express.json());

// serve uploaded docs at /uploads/docs/filename
app.use('/uploads', express.static(uploadRoot));

// ——— Routes ———
// Auth (signup/login for all roles)
app.use('/api/auth', authRoutes);

// Admin (protected)
app.use('/api/admin', protectAdmin, adminRoutes);

// Freelancer routes (includes both public and protected endpoints)
app.use('/api', freelancerRoutes);

// Project and bid routes
app.use('/api', projectRoutes);
app.use('/api', bidRoutes);

// ——— Error handler ———
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

// ——— Start ———
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('🌐 MongoDB connected');
    app.listen(port, () =>
      console.log(`🚀 Server running on http://localhost:${port}`)
    );
  })
  .catch(err => console.error('MongoDB error:', err));