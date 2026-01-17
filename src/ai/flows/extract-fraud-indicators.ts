'use server';

/**
 * @fileOverview AI flow to extract text and fraud indicators from a scanned Aadhaar card image.
 *
 * - extractFraudIndicators - Extracts data and fraud indicators from an Aadhaar image.
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
  name: z.string().nullable().describe('The name extracted from the Aadhaar card.'),
  dateOfBirth: z.string().nullable().describe('The date of birth extracted from the Aadhaar card in DD/MM/YYYY format.'),
  gender: z.string().nullable().describe('The gender extracted from the Aadhaar card.'),
  address: z.string().nullable().describe('The full address extracted from the Aadhaar card.'),
  aadhaarNumber: z.string().nullable().describe('The 12-digit Aadhaar number extracted from the card, formatted as XXXX XXXX XXXX.'),
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
  prompt: `You are an expert AI system specializing in the forensic analysis of identity documents. Your primary task is to identify signs of **digital forgery or tampering** in the provided image.

**Analysis Focus:**
Your goal is to identify visual evidence of digital manipulation. You should **NOT** report issues just because the document is not an official government-issued ID (like an Aadhaar card). The image could be a custom-made ID. Your job is to determine if THAT specific image has been tampered with.

Focus on these indicators of forgery:
*   **Font & Alignment:** Look for inconsistent fonts, varied character spacing, or text that is misaligned.
*   **Digital Artifacts:** Scrutinize the image for pixelation around text, blurry patches, unnatural shadows, or inconsistent background textures that suggest cloning or erasing.
*   **Screenshot Indicators:** Detect non-document elements like phone status bars, application windows, or unusual cropping.

**Data Extraction:**
While analyzing, also perform Optical Character Recognition (OCR) to extract these fields if present:
*   Name
*   Date of Birth
*   Gender
*   Address
*   Aadhaar Number (or any ID number present)

**Output Rules:**
*   Populate the extracted data fields. If a field is not present, return null for it.
*   For the \`fraudIndicators\` field, provide a concise, bulleted list of any suspicious findings from your visual analysis.
*   **Crucially, if you find no evidence of digital tampering, you MUST respond with "No fraud indicators found." for the \`fraudIndicators\` field.** This is true even if the document is not a government ID, has non-standard formatting, or contains text like "Not a government-issued ID".

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
