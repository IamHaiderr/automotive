const router = require("express").Router()
const Car = require("../models/carSchema")
const cloudinary = require("../helper/cloudinary");
const fs = require("fs");
const upload = require("../helper/multer");

// List cars available for sale on installments
router.get('/sell-cars', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page, default to 1
        const perPage = parseInt(req.query.perPage) || 10; // Number of items per page, default to 10

        // Calculate the skip value based on the current page and items per page
        const skip = (page - 1) * perPage;

        const carsForInstallments = await Car.find({ status: 'available', installmentEligible: false })
            .skip(skip) // Skip the appropriate number of items
            .limit(perPage); // Limit the results to the specified number per page

        res.status(200).json(carsForInstallments);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving cars for sale on installments.' });
    }
});


// Create a new car listing for sale on installments
router.post('/sell-cars', upload.array("carImage", 5), async (req, res) => {
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
        installmentEligible: false,
    });
    // Implement logic for installment setup, such as setting installment plans
    const savedCar = await newCarForInstallments.save();
    res.status(201).json(savedCar);
    // } catch (error) {
    //     res.status(500).json({ error: 'An error occurred while creating the car listing for installments.' });
    // }
});

// Update a car listing for sale on installments


// Delete a car listing for sale on installments
router.delete('/sell-cars/:id', async (req, res) => {
    try {
        await Car.findByIdAndRemove(req.params.id);
        await res.status(200).send("Listed car deleted successfully!")
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the car listing for installments.' });
    }
});


module.exports = router