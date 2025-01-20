/**
 * @module DonationController
 * @description Controller functions for handling donation-related operations
 */

const DonationRecord = require('../models/donationrecord.model');
const Donor = require('../models/donor.model');
const BloodCenter = require('../models/bloodcenter.model');

const donationController = {
    /**
     * Record a new blood donation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    recordDonation: async (req, res) => {
        try {
            // Verify donor exists
            const donor = await Donor.findById(req.body.donorId);
            if (!donor) {
                return res.status(404).json({ message: 'Donor not found' });
            }

            // Create donation record
            const donationRecord = new DonationRecord({
                donorId: req.body.donorId,
                hospitalId: req.bloodCenter.id, // From auth middleware
                bloodGroup: req.body.bloodGroup,
                status: 'Completed',
                donationDate: req.body.donationDate,
                medicalNotes: req.body.medicalNotes
            });

            // Save record
            await donationRecord.save();

            // Update donor's last donation date
            donor.lastDonationDate = req.body.donationDate;
            await donor.save();

            res.status(201).json({
                message: 'Donation recorded successfully',
                donationId: donationRecord.donationId
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error recording donation',
                error: error.message
            });
        }
    },

    /**
     * Get all donations for a specific blood center
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    getCenterDonations: async (req, res) => {
        try {
            const donations = await DonationRecord.find({ hospitalId: req.params.centerId })
                .populate('donorId', 'donorName bloodGroup')
                .sort({ donationDate: -1 });

            res.json(donations);
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching donations',
                error: error.message
            });
        }
    },

    /**
     * Get donation history for a specific donor
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    getDonorDonations: async (req, res) => {
        try {
            const donations = await DonationRecord.find({ donorId: req.params.donorId })
                .populate('hospitalId', 'centerName')
                .sort({ donationDate: -1 });

            res.json(donations);
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching donor donations',
                error: error.message
            });
        }
    },

    /**
     * Update donation status
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    updateDonationStatus: async (req, res) => {
        try {
            const donation = await DonationRecord.findOne({ 
                donationId: req.params.donationId,
                hospitalId: req.bloodCenter.id
            });

            if (!donation) {
                return res.status(404).json({ message: 'Donation record not found' });
            }

            donation.status = req.body.status;
            donation.medicalNotes = req.body.medicalNotes || donation.medicalNotes;

            await donation.save();

            res.json({
                message: 'Donation status updated successfully',
                donation
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error updating donation status',
                error: error.message
            });
        }
    }
};

module.exports = donationController;