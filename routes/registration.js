const express = require("express");
const router = new express.Router();
const userdb = require("../schemas/registration");
var bcrypt = require("bcryptjs");
let authenticate = require('../middleware/authenticate.js')
var jwt = require('jsonwebtoken');
const secreatKey = 'thisisthesecreattokenkey'


router.post("/register", async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {

        const preuser = await userdb.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "This Email is Already Exist" })
        } else {


            const hashPass = await bcrypt.hash(password, 10)

            const finalUser = new userdb({
                name, email, password: hashPass
            });

            const storeData = await finalUser.save();

            // console.log(storeData);
            res.status(201).json({ status: 201, storeData })
        }

    } catch (error) {
        res.status(422).json(error);
        console.log("error");
    }

});




router.post("/login", async (req, res) => {


    const { email, password } = req.body;


    if (!email || !password) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {
        const userValid = await userdb.findOne({ email: email });


        if (userValid) {

            const isMatch = await bcrypt.compare(password, userValid.password);

            if (!isMatch) {
                res.status(450).json({status:450, error: "invalid details" })
            } else {

                const token = await userValid.generateAuthtoken();

                res.cookie("usercookie", token, {
                    expires: new Date(Date.now() + 600000),
                    httpOnly: true
                });


                const result = {
                    userValid,
                    token
                }
                res.status(201).json({ status: 201, result })
            }
           
        } else {
            res.status(501).json({ status: 501, message:'user not registered' })

        }

    } catch (error) {
        res.status(401).json(error);
        console.log("->>>>> catch block");
    }


});





router.post('/auth/google', async (req, res) => {
    const { email, name } = req.body;
    try {
        const existUser = await userdb.findOne({ email })

        if (!existUser) {
            let token = jwt.sign({ email }, 'thisisthesecreattokenkey', {
                expiresIn: '600sec'
            });

            const newUser = new userdb({ name, email, tokens: token });
            await newUser.save();

            res.status(201).json({ status: 201, message: 'User data saved successfully', token, newUser });
        } else {


            let token = jwt.sign({ email }, 'thisisthesecreattokenkey', {
                expiresIn: '600sec'
            });

            const newUser = await userdb.findOne({ email })

            res.status(201).json({ status: 201, token, newUser });

        }


    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});






router.get("/validuser", authenticate, async (req, res) => {

    try {
        const ValidUserOne = await userdb.findOne({ _id: req.id });
        res.status(201).json({ status: 201, ValidUserOne });
    } catch (error) {
        res.status(401).json({ status: 401, error });
    }
});


module.exports = router




