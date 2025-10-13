import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function RequestCryptocurrency() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Cryptocurrency</CardTitle>
        <CardDescription>
          Request cryptocurrency from another user.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <div>
            <Label htmlFor="cryptocurrency">Cryptocurrency</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="btc">Bitcoin</SelectItem>
                <SelectItem value="eth">Ethereum</SelectItem>
                <SelectItem value="ltc">Litecoin</SelectItem>
                <SelectItem value="doge">Dogecoin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="e.g., 0.5" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Write a message to the sender" />
          </div>
          <Button>Send Request</Button>
        </form>
      </CardContent>
    </Card>
  );
}
