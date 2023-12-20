import express from 'express'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; 
// Load environment variables from .env file
dotenv.config();


const userRouter = express.Router();

userRouter.post("/signup", async (req, res, next) => {
    try {
      const existingUser = await User.findOne({ username: req.body.username.toLowerCase() });
        
      const existingEmail = await User.findOne({ email: req.body.email.toLowerCase()});

      if (existingUser) {
        res.status(403);
        return next(new Error("That username is already taken"));
      }

      if(existingEmail){
        res.status(403);
        return next(new Error("Email is already taken"))
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

  userRouter.post("/login", async (req, res, next) => {
    try {
      // Validate the incoming data
      if (!req.body.username || !req.body.password) {
        res.status(400);
        return next(new Error("Username and password are required"));
      }
  
      // Find the user by username (assuming usernames are unique)
      const user = await User.findOne({ username: req.body.username.toLowerCase() });
  
      if (!user) {
        res.status(403);
        return next(new Error("Username or password is incorrect"));
      }
  
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(req.body.password, user.password);
  
      if (!isMatch) {
        res.status(403);
        return next(new Error("Username or password is incorrect"));
      }
  
      // Generate a token for the user (assuming you have a withoutPassword method)
      const token = jwt.sign(user.withoutPassword(), process.env.SECRET);
  
      // Return the token and user details in the response
      return res.status(200).json({ token, user: user.withoutPassword() });
    } catch (error) {
      // Handle any errors that occurred during the login process
      console.error('Error logging in:', error);
      res.status(500);
      return next(error);
    }
  });
  
  export default userRouter;