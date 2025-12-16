import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const rides = [
  {
    id: 'RIDE-001',
    date: '2024-07-28',
    passenger: 'Emily R.',
    fare: '12.50',
    status: 'Completed',
  },
  {
    id: 'RIDE-002',
    date: '2024-07-28',
    passenger: 'Michael B.',
    fare: '28.00',
    status: 'Completed',
  },
  {
    id: 'RIDE-003',
    date: '2024-07-27',
    passenger: 'Jessica L.',
    fare: '8.75',
    status: 'Completed',
  },
  {
    id: 'RIDE-004',
    date: '2024-07-27',
    passenger: 'David C.',
    fare: '15.20',
    status: 'Cancelled',
  },
];

export default function RideHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ride History"
        description="A log of all your past rides."
      />
      <Card>
        <CardHeader>
          <CardTitle>Completed Rides</CardTitle>
          <CardDescription>
            Browse through your completed and cancelled rides.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ride ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Passenger</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Fare</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rides.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell className="font-medium">{ride.id}</TableCell>
                  <TableCell>{ride.date}</TableCell>
                  <TableCell>{ride.passenger}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ride.status === 'Completed' ? 'default' : 'destructive'
                      }
                      className={
                        ride.status === 'Completed'
                          ? 'bg-green-500/80'
                          : 'bg-red-500/80'
                      }
                    >
                      {ride.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    €{ride.fare}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
