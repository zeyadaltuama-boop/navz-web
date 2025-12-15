'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { CheckCircle, FileUp, Loader, ShieldAlert, ShieldCheck, XCircle } from 'lucide-react';

import { checkComplianceAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
        <ShieldCheck className="mr-2 h-4 w-4" />
        Check Compliance
        </>
      )}
    </Button>
  );
}

export default function ComplianceForm() {
  const [state, formAction] = useFormState(checkComplianceAction, initialState);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>New Compliance Check</CardTitle>
          <CardDescription>
            Upload a driver's document and provide the requirements to check for compliance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document">Driver Document</Label>
            <div className="relative">
                <FileUp className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="document" name="document" type="file" className="pl-9 file:mr-4 file:font-semibold file:text-primary" required />
            </div>
            {state?.errors?.document && <p className="text-sm text-destructive">{state.errors.document[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="requirements">Compliance Requirements</Label>
            <Textarea
              id="requirements"
              name="requirements"
              placeholder="e.g., Document must be a valid driver's license, not expired, and issued in Portugal..."
              rows={5}
              required
            />
            {state?.errors?.requirements && <p className="text-sm text-destructive">{state.errors.requirements[0]}</p>}
          </div>

          {state.message && state.isCompliant !== undefined && (
            <Alert variant={state.isCompliant ? 'default' : 'destructive'} className={state.isCompliant ? "bg-green-500/10 border-green-500/30" : ""}>
                {state.isCompliant ? <CheckCircle className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                <AlertTitle className="font-bold">
                    {state.isCompliant ? "Document is Compliant" : "Compliance Issues Found"}
                </AlertTitle>
                <AlertDescription>
                    {state.issues}
                </AlertDescription>
            </Alert>
          )}

          {state.message && state.isCompliant === undefined && !state.errors && (
             <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

        </CardContent>
        <CardFooter className="justify-end">
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
