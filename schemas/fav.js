const mongoose = require('mongoose')
const Schema = mongoose.Schema;



const userFav = new Schema({
 
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
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'users'
  },
});


const registrationSchema = mongoose.model('favourites', userFav);
module.exports = registrationSchema