'use server';
/**
 * @fileOverview A face matching AI agent.
 *
 * - faceMatch - A function that handles the face matching process.
 * - FaceMatchInput - The input type for the faceMatch function.
 * - FaceMatchOutput - The return type for the faceMatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FaceMatchInputSchema = z.object({
  idCardPhoto: z
    .string()
    .describe(
      "A data URI of the photo from the ID card. The format must be 'data:<mimetype>;base64,<encoded_data>'."
    ),
  liveUserPhoto: z
    .string()
    .describe(
      "A data URI of the live photo of the user from a webcam. The format must be 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type FaceMatchInput = z.infer<typeof FaceMatchInputSchema>;

const FaceMatchOutputSchema = z.object({
  isMatch: z
    .boolean()
    .describe('Whether the two faces are determined to be the same person.'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'The confidence score of the match, from 0.0 (no match) to 1.0 (perfect match).'
    ),
  reasoning: z
    .string()
    .describe('A brief explanation for the matching decision.'),
});
export type FaceMatchOutput = z.infer<typeof FaceMatchOutputSchema>;

export async function faceMatch(
  input: FaceMatchInput
): Promise<FaceMatchOutput> {
  return faceMatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faceMatchPrompt',
  input: {schema: FaceMatchInputSchema},
  output: {schema: FaceMatchOutputSchema},
  prompt: `You are an advanced AI face verification system. Your task is to compare two images and determine if they show the same person.

- Image 1 is a photo from an official ID card.
- Image 2 is a live photo captured from a webcam.

Analyze key facial features (eyes, nose, mouth, jawline, ears) in both images. Account for minor variations in lighting, angle, and expression.

Based on your analysis, determine if it's a match. Provide a confidence score between 0.0 (no match) and 1.0 (perfect match). If you are very confident they are the same person, set isMatch to true and provide a high confidence score (e.g., > 0.85). If you have any doubt, set it to false and provide a lower confidence score. Provide a brief reasoning for your decision.

ID Card Photo: {{media url=idCardPhoto}}
Live User Photo: {{media url=liveUserPhoto}}`,
});

const faceMatchFlow = ai.defineFlow(
  {
    name: 'faceMatchFlow',
    inputSchema: FaceMatchInputSchema,
    outputSchema: FaceMatchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
