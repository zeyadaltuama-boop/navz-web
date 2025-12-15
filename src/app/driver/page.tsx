import { ArrowUpRight, CheckCircle, Clock, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { PageHeader } from '@/components/page-header';
import AvailabilityToggle from '@/components/driver/availability-toggle';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const rides = [
    {
        passenger: 'Emily R.',
        avatarId: 'user-avatar-1',
        pickup: 'Downtown Plaza',
        fare: '12.50',
        distance: '5.2 km',
    },
    {
        passenger: 'Michael B.',
        avatarId: 'user-avatar-3',
        pickup: 'Airport Terminal 2',
        fare: '28.00',
        distance: '15.8 km',
    },
];

const getAvatar = (id: string) => PlaceHolderImages.find(img => img.id === id);

export default function DriverDashboard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <PageHeader title="Dashboard" description="Here's what's happening today." />
        <AvailabilityToggle />
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-sm text-muted-foreground">€</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€4,291.80</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rides Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+12 since yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Online</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.5</div>
            <p className="text-xs text-muted-foreground">+5 hours from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <span className="text-sm text-muted-foreground">⭐</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.92</div>
            <p className="text-xs text-muted-foreground">Top 5% of drivers</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Incoming Ride Requests</CardTitle>
          <CardDescription>Accept or decline new ride opportunities.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Passenger</TableHead>
                <TableHead className="hidden md:table-cell">Pickup Location</TableHead>
                <TableHead className="hidden md:table-cell">Distance</TableHead>
                <TableHead className="text-right">Fare</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rides.map(ride => (
                <TableRow key={ride.passenger}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                           <AvatarImage src={getAvatar(ride.avatarId)?.imageUrl} alt="Avatar" />
                           <AvatarFallback>{ride.passenger.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{ride.passenger}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{ride.pickup}</TableCell>
                   <TableCell className="hidden md:table-cell">{ride.distance}</TableCell>
                  <TableCell className="text-right">€{ride.fare}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20 hover:text-green-800">
                            <CheckCircle className="mr-2 h-4 w-4"/> Accept
                        </Button>
                        <Button variant="outline" size="sm" className="bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20 hover:text-red-800">
                            <XCircle className="mr-2 h-4 w-4"/> Decline
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
