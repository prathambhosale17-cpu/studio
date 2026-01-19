import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
  console.warn(
    '\n🚨 AI Service Misconfigured: Your Gemini API key is missing or invalid.' +
    '\nPlease add a valid GEMINI_API_KEY to your .env file and restart the server.' +
    '\nYou can get a key from Google AI Studio: https://aistudio.google.com/app/apikey\n'
  );
}

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: 'googleai/gemini-2.5-flash',
});
