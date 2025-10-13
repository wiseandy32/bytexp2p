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
import { Textarea } from "@/components/ui/textarea";

export default function CreateTrade() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Trade</CardTitle>
        <CardDescription>
          Fill in the details to create a new trade.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <div>
            <Label htmlFor="cryptocurrency">Cryptocurrency</Label>
            <Input id="cryptocurrency" placeholder="e.g., Bitcoin" />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="e.g., 0.5" />
          </div>
          <div>
            <Label htmlFor="price">Price (per unit)</Label>
            <Input id="price" type="number" placeholder="e.g., 50000" />
          </div>
          <div>
            <Label htmlFor="terms">Terms of Trade</Label>
            <Textarea
              id="terms"
              placeholder="Describe the terms of your trade"
            />
          </div>
          <Button>Create Trade</Button>
        </form>
      </CardContent>
    </Card>
  );
}
