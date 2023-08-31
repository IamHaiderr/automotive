const router = require("express").Router()
const Car = require("../models/carSchema")
const cloudinary = require("../helper/cloudinary");
const fs = require("fs");
const upload = require("../helper/multer");

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
router.post('/installment-cars', upload.array("carImage", 5), async (req, res) => {
    // try {
    const files = req.files;
    const carImage = [];
    //cloudinary
    if (!files || files?.length < 1)
        return res.status(401).json({
            message: "You have to upload at least one image to the listing",
        });
    for (const file of files) {
        const { path } = file;
        try {
            const uploader = await cloudinary.uploader.upload(path, {
                folder: "automotive",
            });
            carImage.push(uploader.url);
            fs.unlinkSync(path);
        } catch (err) {
            if (carImage?.length) {
                const imgs = imgObjs.map((obj) => obj.public_id);
                cloudinary.api.delete_resources(imgs);
            }
            console.log(err);
        }
    }
    ///////
    const newCarForInstallments = new Car({
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        image: carImage,
        price: req.body.price,
        status: req.body.status,
        installmentEligible: req.body.installments,
        installmentPlans: [
            {
                months: req.body.months,
                downPayment: req.body.downPayment,
                monthlyPayment: req.body.monthlyPayment,
            },
        ],
    });
    // Implement logic for installment setup, such as setting installment plans
    const savedCar = await newCarForInstallments.save();
    res.status(201).json(savedCar);
    // } catch (error) {
    //     res.status(500).json({ error: 'An error occurred while creating the car listing for installments.' });
    // }
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