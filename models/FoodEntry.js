import mongoose, { Schema } from 'mongoose';

const foodEntrySchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  foodName: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const FoodEntry = mongoose.model('FoodEntry', foodEntrySchema);

export default FoodEntry;
