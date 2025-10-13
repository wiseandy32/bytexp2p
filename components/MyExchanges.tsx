import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MyExchanges() {
  const exchanges = [
    {
      id: "1",
      cryptocurrency: "Bitcoin",
      amount: "0.5 BTC",
      price: "$50,000 USD",
      status: "Ongoing",
    },
    {
      id: "2",
      cryptocurrency: "Ethereum",
      amount: "2 ETH",
      price: "$3,000 USD",
      status: "Completed",
    },
    {
      id: "3",
      cryptocurrency: "Litecoin",
      amount: "10 LTC",
      price: "$150 USD",
      status: "Cancelled",
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Trade ID</TableHead>
          <TableHead>Cryptocurrency</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exchanges.map((exchange) => (
          <TableRow key={exchange.id}>
            <TableCell>{exchange.id}</TableCell>
            <TableCell>{exchange.cryptocurrency}</TableCell>
            <TableCell>{exchange.amount}</TableCell>
            <TableCell>{exchange.price}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  exchange.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : exchange.status === "Ongoing"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {exchange.status}
              </span>
            </TableCell>
            <TableCell>
              <Button variant="outline">View</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
