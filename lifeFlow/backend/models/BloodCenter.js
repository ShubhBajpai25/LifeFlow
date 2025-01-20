/**
 * @module BloodCenter
 * @description Defines the schema for the BloodCenter model in the database, representing both hospitals and blood donation centers.
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} BloodCenter
 * @property {string} centerId - Unique identifier for the blood center
 * @property {string} centerName - Name of the blood center
 * @property {string} centerType - Type of center (Hospital/Blood Bank)
 * @property {string} location - Address of the blood center
 * @property {string} contactNumber - Contact number of the blood center
 * @property {Array.<string>} bloodTypesNeeded - Blood types currently needed
 * @property {boolean} isActive - Indicates if center is actively seeking donations
 * @property {string} centerCreatedAt - Timestamp of when the center was registered
 */

/**
 * Mongoose schema for the BloodCenter model
 * @type {mongoose.Schema}
 */
const bloodCenterSchema = new mongoose.Schema({
    centerId: {
        type: String,
        default: function() { return this.constructor.generateCenterId(); },
        unique: true,
    },
    centerName: {
        type: String,
        validate: {
            validator: function(name) {
                return /^[a-zA-Z0-9\s ]+$/.test(name) && (name.length >= 3 && name.length <= 100);
            },
            message: 'Invalid name format. Center name should be between 3 and 100 characters.',
        },
        required: true,
    },
    centerType: {
        type: String,
        enum: ['Hospital', 'Blood Bank'],
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        validate: {
            validator: function(number) {
                return /^\+?[\d\s-]{10,}$/.test(number);
            },
            message: 'Invalid contact number format.',
        },
        required: true,
    },
    bloodTypesNeeded: [{
        type: String,
        validate: {
            validator: function(group) {
                return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(group);
            },
            message: 'Invalid blood group.',
        }
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
    centerCreatedAt: {
        type: String,
        default: function() {
            return new Date().toLocaleString();
        }
    }
});

/**
 * Generates a unique identifier for the blood center.
 * The format is "CTR[randomDigits]-33-[threeRandomLetters]".
 * @returns {string} A unique identifier for the blood center.
 * @private
 */
bloodCenterSchema.statics.generateCenterId = function() {
    let randomDigits = Math.floor(Math.random() * 1000);
    let stuId = 33;
    let threeRandLetters = this.generateRandomLetters();
    return "CTR" + randomDigits + "-" + stuId + "-" + threeRandLetters;
}

/**
 * Generates three random uppercase letters.
 * @returns {string} A string containing three random uppercase letters.
 * @private
 */
bloodCenterSchema.statics.generateRandomLetters = function() {
    let letters = '';
    for (let i = 0; i < 3; i++){
        letters += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    return letters;
}

module.exports = mongoose.model('BloodCenter', bloodCenterSchema);