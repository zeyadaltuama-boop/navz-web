import { PageHeader } from '@/components/page-header';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="View platform analytics and reports."
      />
      <div className="flex h-96 w-full items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Analytics dashboard will be here.</p>
      </div>
    </div>
  );
}
