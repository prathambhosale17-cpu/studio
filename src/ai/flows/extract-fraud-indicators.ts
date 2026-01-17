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
  prompt: `You are an expert AI system designed for forensic analysis of Indian Aadhaar cards. Your task is to act as an OCR and Rule Engine to detect signs of digital forgery or tampering.

**Process:**
1.  **OCR Extraction:** First, perform Optical Character Recognition (OCR) on the provided image to extract all visible text content.
2.  **Rule-Based Validation:** Analyze the extracted text against the following rules:
    *   **Aadhaar Number:** Must be in the format \`XXXX XXXX XXXX\`. Report any format violations.
    *   **Date of Birth (DOB):** Must be in a valid \`DD/MM/YYYY\` format. Report any invalid formats.
    *   **Gender:** Must be a standard value (e.g., Male, Female, Transgender). Report any anomalies.
3.  **Visual Forensic Analysis:** Concurrently, analyze the image for visual signs of tampering:
    *   **Font & Alignment:** Look for inconsistent fonts, character spacing, or text fields that are not perfectly aligned. These are strong indicators of digital text replacement.
    *   **Digital Editing:** Identify any artifacts from editing software like Photoshop, such as blurry areas, pixelation around text, or inconsistent background textures.
    *   **Screenshot Artifacts:** Detect any non-document elements like phone status bars, application windows, or unusual cropping that indicate the image is a screenshot.

**Output:**
Provide a concise summary of all fraud indicators found. If the analysis passes all checks (both text and visual), respond *only* with "No fraud indicators found."

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
