const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  carId: mongoose.Schema.Types.ObjectId,
  paymentAmount: Number,
  paymentDate: Date,
  paymentType: String, // 'installment' or 'full'
  pendingPayment: Number,
  installmentPlan: [
    {
      months: { type: Number },
      downPayment: { type: Number },
      monthlyPayment: { type: Number },
    },
  ],
});

const PaymentHistory = mongoose.model("PaymentHistory", paymentHistorySchema);

module.exports = PaymentHistory;
