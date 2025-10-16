import Deposit from "@/components/Deposit";

export default function DepositPage({ searchParams }: { searchParams: { token?: string, amount?: string } }) {
  return (
    <div>
      <Deposit token={searchParams.token} amount={searchParams.amount} />
    </div>
  );
}
