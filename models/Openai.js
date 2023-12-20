// openaiModel.js

import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = 'process.env.API_KEY'; 

const openai = new OpenAI({ key: OPENAI_API_KEY });



export default openaiModel;
