const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
    Store_Name: {
        type: String,
        required: true,
        unique: true
    },
    Buissnes_hour: {
        type: String,
        required: true
    },
    Store_Phone_number: {
        type: String,
        required: true
    },
    Store_adress: {
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
