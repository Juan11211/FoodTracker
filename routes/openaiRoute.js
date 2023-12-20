// foodEntryRoute.js

import express from 'express';
import fetch from 'node-fetch'; 
import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; 

const openaiRoute = express.Router();
const openai = new OpenAI({ key: OPENAI_API_KEY });

openaiRoute.post('/completions', async (req, res) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'How many calories are in a slice of cheese pizza?' }],
        max_tokens: 100,
      }),
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    res.status(201).send(data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default openaiRoute;
