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
  name: z.string().optional().describe('The name extracted from the Aadhaar card.'),
  dateOfBirth: z.string().optional().describe('The date of birth extracted from the Aadhaar card in DD/MM/YYYY format.'),
  gender: z.string().optional().describe('The gender extracted from the Aadhaar card.'),
  address: z.string().optional().describe('The full address extracted from the Aadhaar card.'),
  aadhaarNumber: z.string().optional().describe('The 12-digit Aadhaar number extracted from the card, formatted as XXXX XXXX XXXX.'),
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
  prompt: `You are an expert AI system specializing in the forensic analysis of identity documents, with a focus on Indian Aadhaar cards. Your primary task is to identify signs of digital forgery or tampering in the provided image.

**ASSUME the document is intended to be an Aadhaar card and focus on identifying inconsistencies.**

**Process:**
1.  **OCR Data Extraction:** First, perform Optical Character Recognition (OCR) on the image to extract the following fields if they are present:
    *   Name
    *   Date of Birth
    *   Gender
    *   Address
    *   Aadhaar Number

2.  **Visual Forensic Analysis:** This is your main priority. Carefully analyze the image for visual evidence of digital manipulation:
    *   **Font & Alignment:** Look for inconsistent fonts, varied character spacing, or text that is misaligned with other fields. These are common signs of text being digitally inserted.
    *   **Digital Artifacts:** Scrutinize the image for artifacts from editing software, such as pixelation around text, blurry patches, unnatural shadows, or inconsistent background textures that could indicate cloning or erasing.
    *   **Ghosting or Overlays:** Check for faint outlines of previous text or images beneath the current content.
    *   **Screenshot Indicators:** Detect any non-document elements like phone status bars, application windows, or unusual cropping that suggest the image is a screenshot rather than a direct scan.

**Output Rules:**
-   Populate all the extracted data fields you can find (name, dateOfBirth, gender, address, aadhaarNumber). If a field is not present, omit it.
-   For the \`fraudIndicators\` field, provide a concise, bulleted list of any suspicious findings from your Visual Forensic Analysis.
-   **If no visual tampering or major inconsistencies are found**, respond with "No fraud indicators found." for the \`fraudIndicators' field. Do not report issues just because the document is not a government-issued Aadhaar card; focus on signs of active tampering.

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
