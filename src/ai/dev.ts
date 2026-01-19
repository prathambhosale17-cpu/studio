import { config } from 'dotenv';
config();

import '@/ai/flows/face-match-flow.ts';
import '@/ai/flows/extract-fraud-indicators.ts';
import '@/ai/flows/extract-id-details.ts';
import '@/ai/flows/answer-doubt-flow.ts';
