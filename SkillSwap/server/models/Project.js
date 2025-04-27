// server/models/Project.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ProjectSchema = new Schema({
  title:       { type: String, required: true },
  description: { type: String },
  deadline:    { type: Date },
  clientId:    { type: Schema.Types.ObjectId, ref: 'Client' },
  status:      { type: String, default: 'open' }
}, { timestamps: true });

module.exports = model('Project', ProjectSchema);
