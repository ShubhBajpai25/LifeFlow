/**
 * @module DonationRecord
 * @description Defines the schema for tracking blood donation records in the database.
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} DonationRecord
 * @property {string} donationId - Unique identifier for the donation record
 * @property {mongoose.Schema.Types.ObjectId} donorId - Reference to the donor
 * @property {mongoose.Schema.Types.ObjectId} hospitalId - Reference to the hospital
 * @property {string} bloodGroup - Blood group donated
 * @property {string} status - Status of the donation
 * @property {Date} donationDate - Date when donation was made
 * @property {string} medicalNotes - Any medical notes or observations
 * @property {string} donationCreatedAt - Timestamp of when the record was created
 */

/**
 * Mongoose schema for the DonationRecord model
 * @type {mongoose.Schema}
 */
const donationRecordSchema = new mongoose.Schema({
    donationId: {
        type: String,
        default: function() { return this.constructor.generateDonationId(); },
        unique: true,
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true,
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
    },
    bloodGroup: {
        type: String,
        required: true,
        validate: {
            validator: function(group) {
                return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(group);
            },
            message: 'Invalid blood group. Must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-',
        },
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Rejected', 'Cancelled'],
        default: 'Pending',
    },
    donationDate: {
        type: Date,
        required: true,
    },
    medicalNotes: {
        type: String,
        maxLength: 500,
    },
    donationCreatedAt: {
        type: String,
        default: function() {
            return new Date().toLocaleString();
        }
    }
});

/**
 * Generates a unique identifier for the donation record.
 * The format is "DON[randomDigits]-33-[threeRandomLetters]".
 * @returns {string} A unique identifier for the donation record.
 * @private
 */
donationRecordSchema.statics.generateDonationId = function() {
    let randomDigits = Math.floor(Math.random() * 1000);
    let stuId = 33;
    let threeRandLetters = this.generateRandomLetters();
    return "DON" + randomDigits + "-" + stuId + "-" + threeRandLetters;
}

/**
 * Generates three random uppercase letters.
 * @returns {string} A string containing three random uppercase letters.
 * @private
 */
donationRecordSchema.statics.generateRandomLetters = function() {
    let letters = '';
    for (let i = 0; i < 3; i++){
        letters += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    return letters;
}

module.exports = mongoose.model('DonationRecord', donationRecordSchema);