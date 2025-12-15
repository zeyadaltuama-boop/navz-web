import { PageHeader } from '@/components/page-header';
import ComplianceForm from './compliance-form';

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Compliance Check"
        description="Use our AI-powered tool to verify driver documents against compliance requirements."
      />
      <div className="max-w-4xl">
        <ComplianceForm />
      </div>
    </div>
  );
}
