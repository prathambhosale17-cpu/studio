import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'AIzaSyD6h5S--03wtzGbTF4NfPM2f4JhxmryAGQ') {
  console.warn(
    '\n🚨 AI Service Misconfigured: Your Gemini API key is missing or invalid.' +
    '\n1. Get a key from Google AI Studio: https://aistudio.google.com/app/apikey' +
    '\n2. Add the key to your .env file.' +
    '\n3. IMPORTANT: Make sure the "Generative Language API" is enabled in your Google Cloud project.' +
    '\n4. Restart the server.\n'
  );
}

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: 'googleai/gemini-2.5-flash',
});
