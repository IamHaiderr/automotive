const router = require("express").Router()

// List cars available for direct purchase
router.get('/buy-cars', async (req, res) => {
    try {
        const carsForDirectPurchase = await Car.find({ status: 'available' });
        res.status(200).json(carsForDirectPurchase);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving cars for direct purchase.' });
    }
});

// Purchase a car directly
router.post('/buy-cars/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car || car.status !== 'available') {
            return res.status(404).json({ error: 'Car not available for purchase.' });
        }

        // Implement payment processing or other business logic here

        car.status = 'sold';
        const updatedCar = await car.save();
        res.status(200).json(updatedCar);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the car purchase.' });
    }
});

module.exports = router