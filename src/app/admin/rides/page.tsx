import { PageHeader } from '@/components/page-header';

export default function RidesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Rides"
        description="Oversee all rides on the platform."
      />
      <div className="flex h-96 w-full items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Ride management interface will be here.</p>
      </div>
    </div>
  );
}
