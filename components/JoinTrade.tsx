import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function JoinTrade() {
  const trades = [
    {
      id: "1",
      cryptocurrency: "Bitcoin",
      amount: "0.5 BTC",
      price: "$50,000 USD",
    },
    {
      id: "2",
      cryptocurrency: "Ethereum",
      amount: "2 ETH",
      price: "$3,000 USD",
    },
    {
      id: "3",
      cryptocurrency: "Litecoin",
      amount: "10 LTC",
      price: "$150 USD",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Input placeholder="Search for trades..." />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cryptocurrency</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Price</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell>{trade.cryptocurrency}</TableCell>
              <TableCell>{trade.amount}</TableCell>
              <TableCell>{trade.price}</TableCell>
              <TableCell>
                <Button>Join</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
