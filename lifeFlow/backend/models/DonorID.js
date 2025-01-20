/**
 * @module DonorID
 * @description Defines the schema for donor identification cards in the database.
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} DonorID
 * @property {string} cardId - Unique identifier for the donor card
 * @property {mongoose.Schema.Types.ObjectId} donorId - Reference to the donor
 * @property {string} cardType - Type of card (physical/electronic)
 * @property {Date} issueDate - Date when card was issued
 * @property {Date} expiryDate - Expiration date of the card
 * @property {boolean} isActive - Whether the card is currently active
 * @property {string} cardCreatedAt - Timestamp of when the card was created
 */

/**
 * Mongoose schema for the DonorID model
 * @type {mongoose.Schema}
 */
const donorIDSchema = new mongoose.Schema({
    cardId: {
        type: String,
        default: function() { return this.constructor.generateCardId(); },
        unique: true,
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true,
    },
    cardType: {
        type: String,
        enum: ['physical', 'electronic'],
        required: true,
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
    expiryDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(date) {
                return date > this.issueDate;
            },
            message: 'Expiry date must be after issue date.',
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    cardCreatedAt: {
        type: String,
        default: function() {
            return new Date().toLocaleString();
        }
    }
});

/**
 * Generates a unique identifier for the donor card.
 * The format is "CRD[randomDigits]-33-[threeRandomLetters]".
 * @returns {string} A unique identifier for the donor card.
 * @private
 */
donorIDSchema.statics.generateCardId = function() {
    let randomDigits = Math.floor(Math.random() * 1000);
    let stuId = 33;
    let threeRandLetters = this.generateRandomLetters();
    return "CRD" + randomDigits + "-" + stuId + "-" + threeRandLetters;
}

/**
 * Generates three random uppercase letters.
 * @returns {string} A string containing three random uppercase letters.
 * @private
 */
donorIDSchema.statics.generateRandomLetters = function() {
    let letters = '';
    for (let i = 0; i < 3; i++){
        letters += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    return letters;
}

/**
 * Pre-save middleware to set expiry date if not provided
 * Default expiry is 2 years from issue date
 */
donorIDSchema.pre('save', function(next) {
    if (!this.expiryDate) {
        const twoYearsFromNow = new Date();
        twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
        this.expiryDate = twoYearsFromNow;
    }
    next();
});

module.exports = mongoose.model('DonorID', donorIDSchema);