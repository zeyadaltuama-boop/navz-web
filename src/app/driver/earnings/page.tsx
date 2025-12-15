import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const earnings = [
    { date: '2024-07-28', rides: 8, total: '112.50', status: 'Paid' },
    { date: '2024-07-27', rides: 10, total: '145.00', status: 'Paid' },
    { date: '2024-07-26', rides: 7, total: '98.00', status: 'Paid' },
    { date: '2024-07-25', rides: 12, total: '180.00', status: 'Paid' },
    { date: '2024-07-24', rides: 9, total: '130.50', status: 'Paid' },
];

export default function EarningsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Earnings"
        description="View your ride history and payout details."
      >
        <Button>
            <Download className="mr-2"/>
            Download Statement
        </Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>This Month&apos;s Earnings</CardTitle>
                <CardDescription>July 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">€2,458.50</p>
                <p className="text-sm text-muted-foreground">+€340.20 from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Next Payout</CardTitle>
                <CardDescription>Scheduled for August 5, 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">€620.00</p>
                <p className="text-sm text-muted-foreground">Covers earnings from July 22 - July 28</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
          <CardDescription>
            A detailed log of your daily earnings and payout status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Rides Completed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earnings.map((earning) => (
                <TableRow key={earning.date}>
                  <TableCell className="font-medium">{earning.date}</TableCell>
                  <TableCell>{earning.rides}</TableCell>
                  <TableCell>{earning.status}</TableCell>
                  <TableCell className="text-right font-semibold">€{earning.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
