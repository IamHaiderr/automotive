const router = require("express").Router()


// List available cars for sale
router.get('/cars', async (req, res) => {
    try {
        const cars = await Car.find({ status: 'available' });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving available cars.' });
    }
});

// Create a new car listing for sale
router.post('/cars', async (req, res) => {
    try {
        const newCar = new Car(req.body);
        const savedCar = await newCar.save();
        res.status(201).json(savedCar);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the car listing.' });
    }
});

// Update a car listing
router.put('/cars/:id', async (req, res) => {
    try {
        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedCar);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the car listing.' });
    }
});

// Delete a car listing
router.delete('/cars/:id', async (req, res) => {
    try {
        await Car.findByIdAndRemove(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the car listing.' });
    }
});


module.exports = router