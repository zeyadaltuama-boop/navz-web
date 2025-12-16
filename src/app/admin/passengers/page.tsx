import { PageHeader } from '@/components/page-header';

export default function PassengersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Passengers"
        description="Manage all passengers on the platform."
      />
      <div className="flex h-96 w-full items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Passenger management interface will be here.</p>
      </div>
    </div>
  );
}
