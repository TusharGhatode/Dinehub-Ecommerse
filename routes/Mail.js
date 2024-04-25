const express = require("express");
const router = new express.Router();
const userdb = require("../schemas/registration");
var bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
var Mailgen = require('mailgen');
const jwt = require("jsonwebtoken");

const keysecret = 'dghvchdddsbcvhdsvggvhchd25656'



// email config

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'tusharghatode16@gmail.com',
        pass: 'nfzu nzhs olum ocxc'

    }
})

var mailGenerator = new Mailgen({
    theme: 'default',
    product: {

        name: 'Dinehub',
        link: 'http://localhost:5173'

    }
});



// send email Link For reset Password
router.post("/sendpasswordlink", async (req, res) => {
    console.log(req.body)

    const { email } = req.body;

    if (!email) {
        res.status(401).json({ status: 401, message: "Enter Your Email" })
    }

    try {
        const userfind = await userdb.findOne({ email: email });

        // token generate for reset password
        const token = jwt.sign({ _id: userfind._id }, keysecret, {
            expiresIn: "1day"
        });

        const setusertoken = await userdb.findByIdAndUpdate({ _id: userfind._id }, { verifytoken: token }, { new: true });


        if (setusertoken) {

            var emailBodyTemp = {
                body: {
                    name: 'USER',
                    intro: 'Welcome to Dinehub! We\'re very excited to have you on board.',
                    action: {
                        instructions: 'To get started with dinehub, please click here:',
                        button: {
                            color: '#22BC66', // Optional action button color
                            text: 'Confirm your account',
                            link: `http://localhost:5173/update/${userfind.id}/${token}`,
                        }
                    },
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
                }
            };
            var emailBody = mailGenerator.generate(emailBodyTemp);




            const mailOptions = {
                from: 'tusharghatode16@gmail.com',
                to: email,
                subject: "Sending Email For password Reset",
                html: emailBody
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("error", error);
                    res.status(401).json({ status: 401, message: "email not send" })
                } else {
                    console.log("Email sent", info.response);
                    res.status(201).json({ status: 201, message: "Email sent Succssfully" })
                }
            })

        }

    } catch (error) {
        res.status(401).json({ status: 401, message: "invalid user" })
    }

});



router.post('/update/:id/:token', async (req, resp) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {

        const user = await userdb.findById(id)

        if (user) {

            const hashPass = await bcrypt.hash(password , 10 )

            const setnewuserpass = await userdb.findByIdAndUpdate(id , { password:hashPass });
            console.log(setnewuserpass)
            setnewuserpass.save();
            resp.status(201).json({ status: 201, setnewuserpass })
        }




    } catch (err) {
        resp.status(401).json({ status: 401, err })
    }
})













router.post("/contact", async (req, res) => {
    console.log(req.body)

    const { contactEmail, contactMessage } = req.body;
   

    if (!contactEmail && !contactMessage) {
        res.status(401).json({ status: 401, message: "enter details" })
    }

    try {
            const mailOptions = {
                from: contactEmail,
                to: 'tusharghatode16@gmail.com',
                subject: "dinehub contact us",
                html: `<div>
                <b>${contactEmail}</b>
                <p>${contactMessage}</p>
                </div>`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("error", error);
                    res.status(401).json({ status: 401, message: "email not send" })
                } else {
                    console.log("Email sent", info.response);
                    res.status(201).json({ status: 201, message: "Email sent Succssfully" })
                }
            })

        

    } catch (error) {
        res.status(401).json({ status: 401, message: "invalid user" })
    }

});







module.exports = router;



