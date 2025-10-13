'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TransactionDetailsPage() {
  const params = useParams();
  const reference = params.reference as string;

  // In a real application, you would fetch transaction data based on the reference
  const transaction = {
    id: reference,
    currency: 'OCTA',
    amount: '2,000.00000000',
    type: 'CREDIT',
    status: 'Waiting',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction ID #{transaction.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
            <div className="grid gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={transaction.status === 'Waiting' ? 'secondary' : 'default'}>
                        {transaction.status}
                    </Badge>
                </div>
            </div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Transaction ID</TableCell>
                <TableCell>{transaction.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Currency</TableCell>
                <TableCell>{transaction.currency}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Amount</TableCell>
                <TableCell>{transaction.amount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Type</TableCell>
                <TableCell>{transaction.type}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex gap-2">
            <Link href={`/user/payment/${transaction.id}`} className="w-full">
                <Button variant="secondary" className="w-full">Make Payment</Button>
            </Link>
            <Link href={`/user/upload-proof/${transaction.id}`} className="w-full">
                <Button className="w-full">Confirm Payment</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}