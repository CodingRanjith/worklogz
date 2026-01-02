// routes/payslipRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const authorizeAccess = require("../middleware/authorizeAccess");
const { createPayslip, getPayslips } = require("../controllers/payslipController");

const router = express.Router();

// POST → create payslip
router.post("/", auth, authorizeAccess, createPayslip);

// GET → fetch all payslips
router.get("/", auth, authorizeAccess, getPayslips);

module.exports = router;
