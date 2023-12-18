import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true
    }
}, {timestamps: true})

userSchema.pre("save", function(next){
    const user = this
    if(!user.isModified("password")) return next()
    bcrypt.hash(user.password, 10, (err, hash) => {
      if(err) return next(err)
      user.password = hash
      next()
    })
  })
  
  // method to check encrypted password on login
  userSchema.methods.checkPassword = function(passwordAttempt, callback){
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
      if(err) return callback(err)
      return callback(null, isMatch)
    })
  }
  
  // method to remove user's password for token/sending the response
  userSchema.methods.withoutPassword = function(){
    const user = this.toObject()
    delete user.password
    return user
  }

const User = mongoose.model('User', userSchema);

export default User

