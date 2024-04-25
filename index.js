const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./db/config.js')
const app = express()
const registrationSchema = require('./routes/registration.js')
const userSchema = require('./schemas/registration.js')
var cookieParser = require('cookie-parser')
const mailSchema = require('./routes/Mail.js')
var jwt = require('jsonwebtoken');
const cartData = require('./routes/cart.js')
require('dotenv').config()


app.use(express.json())
app.use(cors({
    origin: 'https://dinehub1-ecommerse.netlify.app',
    methods: 'GET,POST,DELETE',
    credentials: true
}))
// app.use('/uploads',express.static(__dirname+'/uploads'))



app.use(cookieParser())
app.use(registrationSchema)
app.use(mailSchema)
app.use(cartData)




app.listen(process.env.PORT)
