'use server';

/**
 * @fileOverview AI flow to extract key details from an ID card image using OCR.
 *
 * - extractIdDetails - Extracts ID Number, Name, and DOB from an ID card image.
 * - ExtractIdDetailsInput - The input type for the extractIdDetails function.
 * - ExtractIdDetailsOutput - The return type for the extractIdDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractIdDetailsInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of an ID card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractIdDetailsInput = z.infer<
  typeof ExtractIdDetailsInputSchema
>;

const ExtractIdDetailsOutputSchema = z.object({
  idNumber: z.string().nullable().describe('The ID Number (UID) extracted from the card. This value should start with "IDC-".'),
  name: z.string().nullable().describe('The full name extracted from the card.'),
  dateOfBirth: z.string().nullable().describe('The date of birth extracted from the card.'),
});
export type ExtractIdDetailsOutput = z.infer<
  typeof ExtractIdDetailsOutputSchema
>;

export async function extractIdDetails(
  input: ExtractIdDetailsInput
): Promise<ExtractIdDetailsOutput> {
  return extractIdDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractIdDetailsPrompt',
  input: {schema: ExtractIdDetailsInputSchema},
  output: {schema: ExtractIdDetailsOutputSchema},
  prompt: `You are an expert at Optical Character Recognition (OCR) for identity documents. Your task is to extract specific information from the provided ID card image.

Focus exclusively on extracting the following fields:
*   **ID Number (UID):** Look for a value that starts with "IDC-". This is the most important field.
*   **Name:** The full name of the person.
*   **Date of Birth:** The person's date of birth.

**Rules:**
*   If a field is not present or you cannot read it clearly, you MUST return null for that field.
*   Do not guess or infer any information. Only return data that is clearly visible on the card.

Image: {{media url=imageDataUri}}
  `,
});

const extractIdDetailsFlow = ai.defineFlow(
  {
    name: 'extractIdDetailsFlow',
    inputSchema: ExtractIdDetailsInputSchema,
    outputSchema: ExtractIdDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
