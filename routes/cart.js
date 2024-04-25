const express = require("express");
const router = new express.Router();
const cart = require("../schemas/cart");
const fav = require("../schemas/fav");
const Razorpay = require('razorpay');
const user = require("../schemas/registration");
const authenticate = require("../middleware/authenticate");



router.post("/addToCart/:id", async (req, res) => {
    const id = req.params.id
    const { title, category, price, image, quantity } = req.body


    try {

        const preItem = await cart.findOne({ title: title });
        if (preItem) {
            res.status(422).json({ status: 422, preItem })

        } else {

            const finalUser = new cart({

                title, userId: id, category, price, image, quantity,total:price*quantity
            })

            const storeData = await finalUser.save();
            res.status(201).json({ status: 201, storeData })
        }

    } catch (error) {
        res.status(401).json(error);
        console.log("error");
    }

});




router.get("/fetchData/:id", async (req, res) => {
    const userId = req.params.id

    try {
        const mainUser = await fav.find({ userId: userId })
        res.status(201).json({ status: 201, mainUser })


    } catch (error) {
        res.status(422).json(error);
        console.log("error");
    }

});



router.get("/fetchCartData/:id", async (req, res) => {
    const userId = req.params.id

    try {
        const mainUser = await cart.find({ userId: userId })
        res.status(201).json({ status: 201, mainUser })

    } catch (error) {
        res.status(422).json(error);
        console.log("error");
    }

});






router.delete("/deleteItem/:id", async (req, res) => {
    const id = req.params.id
    const { _id } = req.body

    try {
        const deleted = await cart.findByIdAndDelete({ _id: _id })
        res.status(201).json({ status: 201, deleted })
    } catch (error) {
        res.status(422).json(error);
        console.log("error");
    }

});






router.delete("/deleteFavItem/:id", async (req, res) => {
    const id = req.params.id

    const { _id } = req.body

    try {
        const deleted = await fav.findByIdAndDelete({ _id: _id })

        res.status(201).json({ status: 201, deleted })


    } catch (error) {
        res.status(422).json(error);
        console.log("error");
    }

});




router.post("/favourite/:id", async (req, res) => {
    const userId = req.params.id
    const { title, category, price, image, desc, quantity } = req.body


    try {

        const preItem = await fav.findOne({ title: title });

        if (preItem) {
            res.status(201).json({ status: 201 })
        } else {

            const finalUser = new fav({
                userId, title, category, price, image: image, description: desc, quantity: quantity
            })

            const storeData = await finalUser.save();
            res.status(201).json({ status: 201, storeData })
        }

    } catch (error) {
        res.status(422).json(error);
        console.log("error");
    }

});



//data fetch

router.get("/fetchData/:id", async (req, res) => {
    const userId = req.params.id

    console.log(userId)
    try {
        const mainUser = await fav.find({ userId: userId })
        res.status(201).json({ status: 201, mainUser })


    } catch (error) {
        res.status(422).json(error);
        console.log("error");
    }

});






//updateQuantity

router.post("/update", async (req, res) => {
   
    const { id, quantity,price } = req.body

    try {
        const updateUser = await cart.findByIdAndUpdate(id, { quantity: quantity ,total:quantity*price})
        res.status(201).json({ status: 201, updateUser })


    } catch (error) {
        res.status(422).json(error);
        console.log("error");
    }

});








///checkout

const api_key = "rzp_test_Ufr0wzpkwzWr6F"
const secret_key = 'pzlyeRard67u8Vu9KHmqRyOV'

const instance = new Razorpay({
    key_id: api_key,
    key_secret: secret_key
});



router.post('/checkout', async (req, resp) => {

    var options = {
        amount: req.body.amount * 100,
        currency: "INR",

    };
    const order = await instance.orders.create(options);
    resp.status(201).json({ order, api_key })
})








module.exports = router




