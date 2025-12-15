'use server';

import { driverComplianceCheck } from '@/ai/flows/driver-compliance-check';
import { z } from 'zod';

const complianceSchema = z.object({
  document: z.instanceof(File).refine(file => file.size > 0, 'Document is required.'),
  requirements: z.string().min(1, 'Requirements are required.'),
});

type ComplianceState = {
  message: string;
  isCompliant?: boolean;
  issues?: string;
  errors?: {
    document?: string[];
    requirements?: string[];
  };
};

// Helper function to convert File to Base64 Data URI
const fileToDataURI = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URI'));
      }
    };
    reader.onerror = (error) => reject(error);
    // This part runs on the server, but FileReader is a web API.
    // Next.js server actions can handle this by polyfilling or using Buffer.
    // For simplicity, we assume a modern Edge environment where this might work.
    // A more robust solution would use Buffers.
    const blob = new Blob([file], { type: file.type });
    const readerForBlob = new FileReader();
    readerForBlob.readAsDataURL(blob);
    readerForBlob.onloadend = () => {
        resolve(readerForBlob.result as string);
    }
  });
};

const fileToDataURIBuffer = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function checkComplianceAction(
  prevState: ComplianceState,
  formData: FormData
): Promise<ComplianceState> {
  const validatedFields = complianceSchema.safeParse({
    document: formData.get('document'),
    requirements: formData.get('requirements'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please check the form fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { document, requirements } = validatedFields.data;

  try {
    const documentDataUri = await fileToDataURIBuffer(document);

    const result = await driverComplianceCheck({
      documentDataUri,
      requirements,
    });
    
    if (result.isCompliant) {
        return {
            message: 'Compliance check successful.',
            isCompliant: true,
            issues: result.issues,
        }
    } else {
        return {
            message: 'Compliance issues found.',
            isCompliant: false,
            issues: result.issues,
        }
    }
  } catch (error) {
    console.error(error);
    return {
      message: 'An unexpected error occurred during the compliance check.',
    };
  }
}
