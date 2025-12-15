'use server';

/**
 * @fileOverview Driver compliance check AI agent.
 *
 * - driverComplianceCheck - A function that handles the driver compliance process.
 * - DriverComplianceCheckInput - The input type for the driverComplianceCheck function.
 * - DriverComplianceCheckOutput - The return type for the driverComplianceCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DriverComplianceCheckInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A driver's document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  requirements: z.string().describe('The compliance requirements for the document.'),
});
export type DriverComplianceCheckInput = z.infer<typeof DriverComplianceCheckInputSchema>;

const DriverComplianceCheckOutputSchema = z.object({
  isCompliant: z.boolean().describe('Whether or not the document is compliant.'),
  issues: z.string().describe('A summary of any compliance issues found in the document.'),
});
export type DriverComplianceCheckOutput = z.infer<typeof DriverComplianceCheckOutputSchema>;

export async function driverComplianceCheck(input: DriverComplianceCheckInput): Promise<DriverComplianceCheckOutput> {
  return driverComplianceCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'driverComplianceCheckPrompt',
  input: {schema: DriverComplianceCheckInputSchema},
  output: {schema: DriverComplianceCheckOutputSchema},
  prompt: `You are an expert in verifying driver documents for compliance.

You will check the provided document against the given requirements.

Requirements: {{{requirements}}}

Document: {{media url=documentDataUri}}

Based on your analysis, determine if the document is compliant and set the isCompliant output field accordingly. Provide a detailed summary of any issues found in the document in the issues field. Focus on concrete issues.
`,
});

const driverComplianceCheckFlow = ai.defineFlow(
  {
    name: 'driverComplianceCheckFlow',
    inputSchema: DriverComplianceCheckInputSchema,
    outputSchema: DriverComplianceCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
