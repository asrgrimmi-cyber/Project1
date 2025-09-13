'use server';
/**
 * @fileOverview Provides context-aware task suggestions using a generative AI model.
 *
 * - suggestTaskContent - A function to generate task suggestions based on existing tasks.
 * - SuggestTaskContentInput - The input type for the suggestTaskContent function.
 * - SuggestTaskContentOutput - The return type for the suggestTaskContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskContentInputSchema = z.object({
  existingTasks: z.string().describe('A list of existing task titles and descriptions.'),
  category: z.string().describe('The category or context for the new task.'),
  type: z.enum(['title', 'description']).describe('The type of content to suggest: title or description.'),
});
export type SuggestTaskContentInput = z.infer<typeof SuggestTaskContentInputSchema>;

const SuggestTaskContentOutputSchema = z.object({
  suggestion: z.string().describe('The suggested task title or description.'),
});
export type SuggestTaskContentOutput = z.infer<typeof SuggestTaskContentOutputSchema>;

export async function suggestTaskContent(input: SuggestTaskContentInput): Promise<SuggestTaskContentOutput> {
  return suggestTaskContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskContentPrompt',
  input: {schema: SuggestTaskContentInputSchema},
  output: {schema: SuggestTaskContentOutputSchema},
  prompt: `You are a task suggestion assistant. Given the existing tasks and category, suggest a relevant task {{{type}}}.\n\nExisting Tasks: {{{existingTasks}}}\nCategory: {{{category}}}\nType: {{{type}}}.\nSuggestion:`,
});

const suggestTaskContentFlow = ai.defineFlow(
  {
    name: 'suggestTaskContentFlow',
    inputSchema: SuggestTaskContentInputSchema,
    outputSchema: SuggestTaskContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
