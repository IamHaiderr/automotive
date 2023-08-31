const router = require("express").Router()

// List cars available for sale on installments
router.get('/installment-cars', async (req, res) => {
    try {
        const carsForInstallments = await Car.find({ status: 'available', installmentEligible: true });
        res.status(200).json(carsForInstallments);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving cars for sale on installments.' });
    }
});

// Create a new car listing for sale on installments
router.post('/installment-cars', async (req, res) => {
    try {
        const newCarForInstallments = new Car(req.body);
        // Implement logic for installment setup, such as setting installment plans
        const savedCar = await newCarForInstallments.save();
        res.status(201).json(savedCar);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the car listing for installments.' });
    }
});

// Update a car listing for sale on installments
router.put('/installment-cars/:id', async (req, res) => {
    try {
        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        // Implement logic for updating installment plans, if needed
        res.status(200).json(updatedCar);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the car listing for installments.' });
    }
});

// Delete a car listing for sale on installments
router.delete('/installment-cars/:id', async (req, res) => {
    try {
        await Car.findByIdAndRemove(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the car listing for installments.' });
    }
});


module.exports = router