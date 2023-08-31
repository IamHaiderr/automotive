const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
    installmentEligible: { type: Boolean, default: false },
    installmentPlans: [
        {
            months: { type: Number, required: true },
            downPayment: { type: Number, required: true },
            monthlyPayment: { type: Number, required: true },
        },
    ],
    // Other fields as needed
});

const CarSchema = mongoose.model('Car', carSchema);

module.exports = CarSchema;
