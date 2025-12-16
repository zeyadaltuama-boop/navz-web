import { PageHeader } from '@/components/page-header';

export default function DriversPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Drivers"
        description="Manage all drivers on the platform."
      />
      <div className="flex h-96 w-full items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Driver management interface will be here.</p>
      </div>
    </div>
  );
}
