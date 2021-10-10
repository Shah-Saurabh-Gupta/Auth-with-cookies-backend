const router = require('express').Router();
const Customer = require("../models/customerModel");
const auth = require("../middleware/auth");

//Add Customer name
router.post("/", auth, async (req, res) => {
    try {
        const { name } = req.body;
        const newCustomer = new Customer({
            name
        });
        const savedCustomer = await newCustomer.save();
        res.json(savedCustomer);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

//Get all the customers
router.get("/", auth, async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});


module.exports = router;