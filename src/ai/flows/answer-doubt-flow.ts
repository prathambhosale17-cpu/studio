'use server';
/**
 * @fileOverview An AI flow to answer user questions about government schemes.
 *
 * - answerDoubt - A function that provides an AI-generated answer to a user's question.
 * - AnswerDoubtInput - The input type for the answerDoubt function.
 * - AnswerDoubtOutput - The return type for the answerDoubt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerDoubtInputSchema = z.object({
  title: z.string().describe("The title of the user's question."),
  body: z.string().describe("The detailed body of the user's question."),
  district: z.string().describe("The user's district."),
  category: z.string().describe('The category of the question.'),
});
export type AnswerDoubtInput = z.infer<typeof AnswerDoubtInputSchema>;

const AnswerDoubtOutputSchema = z.object({
  answer: z
    .string()
    .describe(
      'A helpful, concise, and accurate answer to the user\'s question. The answer should be in simple language and provide actionable advice if possible. Assume the user is a farmer or rural citizen in India.'
    ),
});
export type AnswerDoubtOutput = z.infer<typeof AnswerDoubtOutputSchema>;

export async function answerDoubt(
  input: AnswerDoubtInput
): Promise<AnswerDoubtOutput> {
  return answerDoubtFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerDoubtPrompt',
  input: {schema: AnswerDoubtInputSchema},
  output: {schema: AnswerDoubtOutputSchema},
  prompt: `You are Yojana Mitra, an expert AI assistant for government schemes in India. Your goal is to provide clear, helpful, and encouraging answers to questions from farmers and rural citizens.

A user has posted the following question:
- Category: {{{category}}}
- District: {{{district}}}
- Title: {{{title}}}
- Question: {{{body}}}

Please generate a concise and helpful answer. Address the user's specific problem. If you mention a scheme, briefly explain its main benefit. If you suggest an action, make it clear and simple. Keep the tone supportive and easy to understand.
`,
});

const answerDoubtFlow = ai.defineFlow(
  {
    name: 'answerDoubtFlow',
    inputSchema: AnswerDoubtInputSchema,
    outputSchema: AnswerDoubtOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
