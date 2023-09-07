const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    image: { type: Array, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
    installmentEligible: { type: Boolean, default: false },
    installmentPlans: [
        {
            months: { type: Number },
            downPayment: { type: Number },
            monthlyPayment: { type: Number },
        },
    ],
}, {
    timestamps: true
});

const CarSchema = mongoose.model('Car', carSchema);

module.exports = CarSchema;
