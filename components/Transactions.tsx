'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function Transactions() {
  const router = useRouter();
  const transactions = [
    {
      id: "TXNLUKJAYKB",
      amount: "1.0 BTC",
      status: "Completed",
      date: "2024-07-22",
      type: "Deposit",
    },
    {
      id: "2",
      amount: "0.5 ETH",
      status: "Pending",
      date: "2024-07-21",
      type: "Withdrawal",
    },
    {
      id: "3",
      amount: "10.0 LTC",
      status: "Failed",
      date: "2024-07-20",
      type: "Deposit",
    },
    {
      id: "4",
      amount: "100.0 DOGE",
      status: "Completed",
      date: "2024-07-19",
      type: "Trade",
    },
  ];

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/transactions/${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>A list of your recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                onClick={() => handleRowClick(transaction.id)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === "Completed"
                        ? "default"
                        : transaction.status === "Pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
