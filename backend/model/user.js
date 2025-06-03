const mongoose = require('mongoose');
const token = require('jsonwebtoken');
const passwordComplexity = require('joi-password-complexity');


const userSchema = new mongoose.Schema({
    fristname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    return token;
  };
  
const User = mongoose.model('User', userSchema);

const validate = (data) =>{
    const Schema =Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: passwordComplexity().required()
    });
    return Schema.validate(data);
}
module.exports = {User, validate};
