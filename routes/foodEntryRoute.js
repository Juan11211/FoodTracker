import express from 'express';
import FoodEntry from '../models/FoodEntry.js'; 

const foodEntryRoute = express.Router();

foodEntryRoute.get('/', async (req, res) => {
  try {
    const food = await FoodEntry.find();

    return res.status(200).json(food);
  } catch (error) {
   
    console.error('Error fetching food entries:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

foodEntryRoute.post('/', async (req, res) => {
  // Assuming req.auth._id contains the user ID
  const userId = req.auth._id;
  const { foodName, calories, date } = req.body;

  try {
    // Create a new FoodEntry instance
    const newInput = new FoodEntry({
      userId: userId, // Use userId instead of user
      foodName: foodName,
      calories: calories,
      date: date
    });

    // Save the new FoodEntry to the database
    const savedFoodEntry = await newInput.save();

    // Respond with the saved FoodEntry
    res.status(201).json(savedFoodEntry);
  } catch (error) {
    // Handle errors, send a 500 Internal Server Error response
    console.error('Error creating food entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


foodEntryRoute.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const foodPost = await FoodEntry.findById(id);

    return res.status(200).json(foodPost);
  } catch (error) {
    // Handle any errors that occurred during the database query
    console.error('Error fetching food entry:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

foodEntryRoute.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, foodName, calories, date } = req.body;

    // Check if the provided ID is valid and exists in the database
    const existingPost = await FoodEntry.findByIdAndUpdate(id);

    // Update the existing post with the new data
    existingPost.userId = userId;
    existingPost.foodName = foodName;
    existingPost.calories = calories;
    existingPost.date = date;

    // Save the updated post
    const updatedPost = await existingPost.save();

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating food entry:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

foodEntryRoute.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is valid and exists in the database
    const postDeleted = await FoodEntry.findByIdAndDelete(id);


    // If the deletion is successful, return a success message
    return res.status(200).json({ message: 'Food entry deleted successfully', postDeleted });
  } catch (error) {
    console.error('Error deleting food entry:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

foodEntryRoute.get('/user/:userId', async(req, res) => { 
  try {

    // Fetch all food entries for a specific user
    const foodEntries = await FoodEntry.find({ userId: req.params.userId });

    return res.status(200).json(foodEntries);
  } catch (error) {
    console.error('Error fetching food entries:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})


export default foodEntryRoute;
