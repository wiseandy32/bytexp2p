import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Overview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">4</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$12,345</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Completed Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">2</p>
        </CardContent>
      </Card>
    </div>
  );
}
