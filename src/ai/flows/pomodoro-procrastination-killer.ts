'use server';
/**
 * @fileOverview A flow that helps users overcome procrastination by generating a prompt
 * based on the current task title to immediately start working on the task.
 *
 * - pomodoroProcrastinationKiller - A function that takes a task title as input and returns a prompt to overcome procrastination.
 * - PomodoroProcrastinationKillerInput - The input type for the pomodoroProcrastinationKiller function.
 * - PomodoroProcrastinationKillerOutput - The return type for the pomodoroProcrastinationKiller function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PomodoroProcrastinationKillerInputSchema = z.object({
  taskTitle: z.string().describe('The title of the task the user is working on.'),
});
export type PomodoroProcrastinationKillerInput = z.infer<
  typeof PomodoroProcrastinationKillerInputSchema
>;

const PomodoroProcrastinationKillerOutputSchema = z.object({
  prompt: z.string().describe('A prompt to help the user overcome procrastination and start working on the task.'),
});
export type PomodoroProcrastinationKillerOutput = z.infer<
  typeof PomodoroProcrastinationKillerOutputSchema
>;

export async function pomodoroProcrastinationKiller(
  input: PomodoroProcrastinationKillerInput
): Promise<PomodoroProcrastinationKillerOutput> {
  return pomodoroProcrastinationKillerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pomodoroProcrastinationKillerPrompt',
  input: {schema: PomodoroProcrastinationKillerInputSchema},
  output: {schema: PomodoroProcrastinationKillerOutputSchema},
  prompt: `You are a procrastination expert. You are helping a user start working on a task.

The task is called: {{{taskTitle}}}

Generate a single prompt that the user can immediately execute to start working on the task. The prompt should be very simple and actionable.

Example prompt: "Write the first sentence of the introduction."`,
});

const pomodoroProcrastinationKillerFlow = ai.defineFlow(
  {
    name: 'pomodoroProcrastinationKillerFlow',
    inputSchema: PomodoroProcrastinationKillerInputSchema,
    outputSchema: PomodoroProcrastinationKillerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
