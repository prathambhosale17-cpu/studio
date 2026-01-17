'use server';

/**
 * @fileOverview AI flow to extract fraud indicators from a scanned Aadhaar card image.
 *
 * - extractFraudIndicators - Extracts fraud indicators from an Aadhaar image.
 * - ExtractFraudIndicatorsInput - The input type for the extractFraudIndicators function.
 * - ExtractFraudIndicatorsOutput - The return type for the extractFraudIndicators function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractFraudIndicatorsInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of an Aadhaar card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractFraudIndicatorsInput = z.infer<
  typeof ExtractFraudIndicatorsInputSchema
>;

const ExtractFraudIndicatorsOutputSchema = z.object({
  fraudIndicators: z
    .string()
    .describe(
      'A concise summary of potential fraud indicators identified in the Aadhaar image. If no fraud is detected, it should return "No fraud indicators found."'
    ),
});
export type ExtractFraudIndicatorsOutput = z.infer<
  typeof ExtractFraudIndicatorsOutputSchema
>;

export async function extractFraudIndicators(
  input: ExtractFraudIndicatorsInput
): Promise<ExtractFraudIndicatorsOutput> {
  return extractFraudIndicatorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractFraudIndicatorsPrompt',
  input: {schema: ExtractFraudIndicatorsInputSchema},
  output: {schema: ExtractFraudIndicatorsOutputSchema},
  prompt: `You are an expert AI specializing in forensic analysis of identity documents, particularly Indian Aadhaar cards. Your task is to detect signs of digital forgery or tampering in the provided image.

Analyze the Aadhaar card image below for any indicators of fraud. Look for:
- **Digital Editing:** Signs of Photoshop, inconsistent fonts, pixelation around text fields, or misaligned text.
- **Screenshot Artifacts:** Presence of UI elements, unusual cropping, or digital watermarks that suggest it's a screenshot of a digital document rather than a scan of a physical one.
- **Text Replacement:** Check for discrepancies in typography, spacing, or color in names, dates of birth, addresses, or the Aadhaar number itself.

Based on your analysis, provide a concise summary of all fraud indicators you find. If the image appears authentic and unaltered, respond with "No fraud indicators found."

Image: {{media url=imageDataUri}}
  `,
});

const extractFraudIndicatorsFlow = ai.defineFlow(
  {
    name: 'extractFraudIndicatorsFlow',
    inputSchema: ExtractFraudIndicatorsInputSchema,
    outputSchema: ExtractFraudIndicatorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
