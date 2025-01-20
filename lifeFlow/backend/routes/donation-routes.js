/**
 * @module DonationRoutes
 * @description Defines the routes for donation-related operations
 */

const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Blood center routes
router.post('/record', authMiddleware.verifyBloodCenter, donationController.recordDonation);
router.get('/center/:centerId', authMiddleware.verifyBloodCenter, donationController.getCenterDonations);
router.get('/donor/:donorId', authMiddleware.verifyAccess, donationController.getDonorDonations);
router.put('/update/:donationId', authMiddleware.verifyBloodCenter, donationController.updateDonationStatus);

module.exports = router;