const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var jwt = require('jsonwebtoken');
const secreatKey = 'thisisthesecreattokenkey'

const registration = new Schema({
  // author: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    trim: true,
    

  },
 
  tokens:[String]

}, {
  timestamps: true
});


registration.methods.generateAuthtoken = async function () {
  try {


      let token23 = jwt.sign({email:this.email }, 'thisisthesecreattokenkey', {
        expiresIn: '600sec'
    });

      this.tokens = token23;
      await this.save();
      return token23;
      
  } catch (error) {
      res.status(422).json(error)
  }
}


const registrationSchema = mongoose.model('users', registration);
module.exports = registrationSchema