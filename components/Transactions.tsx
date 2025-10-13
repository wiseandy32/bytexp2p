import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Transactions() {
  const transactions = [
    { id: "1", amount: "1.0 BTC", status: "Completed", date: "2024-07-22" },
    { id: "2", amount: "0.5 ETH", status: "Pending", date: "2024-07-21" },
    { id: "3", amount: "10.0 LTC", status: "Failed", date: "2024-07-20" },
    { id: "4", amount: "100.0 DOGE", status: "Completed", date: "2024-07-19" },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.id}</TableCell>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  transaction.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : transaction.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {transaction.status}
              </span>
            </TableCell>
            <TableCell>{transaction.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
