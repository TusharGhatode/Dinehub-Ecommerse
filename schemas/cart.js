const mongoose = require('mongoose')
const Schema = mongoose.Schema;



const userCart = new Schema({
  // author: ObjectId,
  
  image: {
    type: String,
  },
  title: {
    type: String,

  },
  description: {
    type: String,

  },
  quantity: {
    type: Number,

  },
  category: {
    type: String,

  },
  price: {
    type: String,

  },
  total: {
    type: String,

  },
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'users'
  },
});


const registrationSchema = mongoose.model('cart', userCart);
module.exports = registrationSchema