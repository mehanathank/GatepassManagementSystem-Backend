const express = require('express');
const router = express.Router();
const VisitorPass = require('../models/VisitorPass');
const User = require('../models/User');

const mapVisitor = (v) => ({
  id: 'VP' + v._id.toString().slice(-6).toUpperCase(),
  dbId: v._id,
  visitorName: v.visitor_name,
  phoneNumber: v.phone_number,
  purpose: v.purpose,
  date: v.date,
  inTime: v.in_time,
  outTime: v.out_time,
  status: v.status,
  registeredDate: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : '',
  approvedDate: v.updatedAt ? new Date(v.updatedAt).toLocaleDateString() : null,
});

// Get all visitor passes
router.get('/', async (req, res) => {
  try {
    const passes = await VisitorPass.find().sort({ createdAt: -1 });
    res.json(passes.map(mapVisitor));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get pending visitor passes
router.get('/pending', async (req, res) => {
  try {
    const passes = await VisitorPass.find({ status: 'Pending' }).sort({ createdAt: 1 });
    res.json(passes.map(mapVisitor));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register visitor pass
router.post('/register', async (req, res) => {
  const { visitorName, phoneNumber, purpose, date, inTime, outTime } = req.body;
  try {
    const vp = await VisitorPass.create({
      visitor_name: visitorName,
      phone_number: phoneNumber,
      purpose, date,
      in_time: inTime,
      out_time: outTime,
      status: 'Pending',
    });
    res.status(201).json(mapVisitor(vp));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve visitor pass
router.put('/approve/:visitorId', async (req, res) => {
  try {
    const { approvedBy } = req.body;
    let appBy = null;
    if (approvedBy) {
      const u = await User.findOne({ username: approvedBy });
      if (u) appBy = u._id;
    }
    const vp = await VisitorPass.findByIdAndUpdate(
      req.params.visitorId,
      { status: 'Approved', approved_by: appBy },
      { new: true }
    );
    res.json(mapVisitor(vp));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject visitor pass
router.put('/reject/:visitorId', async (req, res) => {
  try {
    const vp = await VisitorPass.findByIdAndUpdate(
      req.params.visitorId,
      { status: 'Rejected' },
      { new: true }
    );
    res.json(mapVisitor(vp));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
