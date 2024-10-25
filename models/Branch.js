const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
    branchName: {
        type: String,
        required: true,
        unique: true
    },
    bussinessHours: {
        type: String,
        required: true
    },
    branchAddress: {
        type: String,
        required: true
    },
    branchPhone: {
        type: String,
        required: true
    },
    location: {
        coordinate_x: { 
            type: Number,
            required: true
        },
        coordinate_y: {
            type: Number,
            required: true
        }
    }
});

module.exports = mongoose.model('Branches', BranchSchema);
