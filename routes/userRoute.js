import express from 'express'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();


const userRouter = express.Router();

userRouter.post("/signup", async (req, res, next) => {
    try {
      const existingUser = await User.findOne({ username: req.body.username.toLowerCase() });
  
      if (existingUser) {
        // If the username is already taken, return a 403 response
        res.status(403);
        return next(new Error("That username is already taken"));
      }
  
      // Create a new user instance with the provided data
      const newUser = new User(req.body);
  
      // Save the new user to the database
      const savedUser = await newUser.save();
  
      // Generate a token for the user (assuming you have a withoutPassword method)
      const token = jwt.sign(savedUser.withoutPassword(), process.env.SECRET);
  
      // Return the token and user details in the response
      return res.status(201).json({ token, user: savedUser.withoutPassword() });
    } catch (error) {
      // Handle any errors that occurred during the signup process
      console.error('Error signing up:', error);
      res.status(500);
      return next(error);
    }
  });
  

  export default userRouter;