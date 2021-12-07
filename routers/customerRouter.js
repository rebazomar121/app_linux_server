const router = require("express").Router();
const Customer = require("../models/customerModel");
const auth = require("../middleware/auth");

router.post("/add",auth, async (req, res) => {
  try {
    const  name  = req.body.name;
    const newCustomer = new Customer({
      name,
    });

    const savedCustomer = await newCustomer.save();
    console.log(savedCustomer)
    res.json(savedCustomer);
  } catch (err) {

    console.error(err);
    res.status(500).send();
  }
});

router.get("/show", auth, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
