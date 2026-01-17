'use server';

/**
 * @fileOverview AI flow to extract fraud indicators from scanned Aadhaar data.
 *
 * - extractFraudIndicators - Extracts fraud indicators from Aadhaar data.
 * - ExtractFraudIndicatorsInput - The input type for the extractFraudIndicators function.
 * - ExtractFraudIndicatorsOutput - The return type for the extractFraudIndicators function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractFraudIndicatorsInputSchema = z.object({
  aadhaarData: z
    .string()
    .describe('The scanned data from the Aadhaar document.'),
});
export type ExtractFraudIndicatorsInput = z.infer<
  typeof ExtractFraudIndicatorsInputSchema
>;

const ExtractFraudIndicatorsOutputSchema = z.object({
  fraudIndicators: z
    .string()
    .describe(
      'A concise summary of potential fraud indicators identified in the Aadhaar data.'
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
  prompt: `You are an AI assistant specializing in identifying fraud indicators in Aadhaar data.
  Analyze the following Aadhaar data and extract potential fraud indicators in a concise summary:

  Aadhaar Data: {{{aadhaarData}}}

  Focus on key indicators such as inconsistencies in data, unusual patterns, or any red flags that suggest fraudulent activity. Return the result as a string.
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
