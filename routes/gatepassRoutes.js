const express = require('express');
const router = express.Router();
const GatePass = require('../models/GatePass');
const User = require('../models/User');

const DEPT_MAP = {
  'CSE':   ['CSE', 'Computer Science', 'cse', 'computer science'],
  'ECE':   ['ECE', 'Electronics', 'ece', 'electronics', 'Electronics and Communication'],
  'EEE':   ['EEE', 'Electrical', 'eee', 'electrical', 'Electrical and Electronics'],
  'IT':    ['IT', 'Information Technology', 'it', 'information technology'],
  'MECH':  ['MECH', 'Mechanical', 'mech', 'mechanical', 'Mechanical Engineering'],
  'CIVIL': ['CIVIL', 'Civil', 'civil', 'Civil Engineering'],
};

const mapPass = (gp) => {
  const u = gp.student_id;
  return {
    id: 'GP' + gp._id.toString().slice(-6).toUpperCase(),
    dbId: gp._id,
    studentId: u?._id || gp.student_id,
    name: u?.name || '',
    rollNumber: u?.roll_number || '',
    department: u?.department || '',
    year: u?.year || '',
    reason: gp.reason,
    outTime: gp.out_time,
    status: gp.status,
    appliedDate: gp.createdAt ? new Date(gp.createdAt).toLocaleDateString() : '',
    approvedDate: gp.updatedAt ? new Date(gp.updatedAt).toLocaleDateString() : null,
  };
};

// Get passes by department (teacher dashboard)
router.get('/department/:dept', async (req, res) => {
  try {
    const dept = req.params.dept;
    const variants = DEPT_MAP[dept.toUpperCase()] || [dept];
    const students = await User.find({ department: { $in: variants }, role: 'student' });
    const studentIds = students.map(s => s._id);
    const passes = await GatePass.find({ student_id: { $in: studentIds } })
      .populate('student_id')
      .sort({ createdAt: -1 });
    res.json(passes.map(mapPass));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all gate passes
router.get('/', async (req, res) => {
  try {
    const passes = await GatePass.find().populate('student_id').sort({ createdAt: -1 });
    res.json(passes.map(mapPass));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get passes for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    let student;
    if (studentId.match(/^[0-9a-fA-F]{24}$/)) {
      student = await User.findById(studentId);
    } else {
      student = await User.findOne({ $or: [{ username: studentId }, { roll_number: studentId }] });
    }
    if (!student) return res.json([]);
    const passes = await GatePass.find({ student_id: student._id })
      .populate('student_id')
      .sort({ createdAt: -1 });
    res.json(passes.map(mapPass));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get pending passes
router.get('/pending', async (req, res) => {
  try {
    const passes = await GatePass.find({ status: 'Pending' })
      .populate('student_id')
      .sort({ createdAt: 1 });
    res.json(passes.map(mapPass));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply for gate pass
router.post('/apply', async (req, res) => {
  const { studentId, reason, outTime, rollNumber, name } = req.body;
  try {
    let student;
    if (studentId && studentId.toString().match(/^[0-9a-fA-F]{24}$/)) {
      student = await User.findById(studentId);
    }
    if (!student && rollNumber) {
      student = await User.findOne({ roll_number: rollNumber });
    }
    if (!student && name) {
      student = await User.findOne({ name });
    }
    if (!student) {
      student = await User.findOne({ role: 'student' });
    }
    if (!student) return res.status(400).json({ error: 'Student not found' });

    const gp = await GatePass.create({
      student_id: student._id,
      reason,
      out_time: outTime,
      status: 'Pending',
    });
    const populated = await GatePass.findById(gp._id).populate('student_id');
    res.status(201).json(mapPass(populated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve gate pass
router.put('/approve/:passId', async (req, res) => {
  try {
    const { approvedBy } = req.body;
    let appBy = null;
    if (approvedBy) {
      const u = await User.findOne({ $or: [{ username: approvedBy }, { name: approvedBy }] });
      if (u) appBy = u._id;
    }
    const gp = await GatePass.findByIdAndUpdate(
      req.params.passId,
      { status: 'Approved', approved_by: appBy },
      { new: true }
    ).populate('student_id');
    res.json(mapPass(gp));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject gate pass
router.put('/reject/:passId', async (req, res) => {
  try {
    const gp = await GatePass.findByIdAndUpdate(
      req.params.passId,
      { status: 'Rejected' },
      { new: true }
    ).populate('student_id');
    res.json(mapPass(gp));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark as used
router.put('/use/:passId', async (req, res) => {
  try {
    const gp = await GatePass.findByIdAndUpdate(
      req.params.passId,
      { status: 'Used' },
      { new: true }
    ).populate('student_id');
    res.json(mapPass(gp));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
