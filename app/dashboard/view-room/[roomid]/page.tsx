"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  runTransaction,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LuInfo } from "react-icons/lu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TradeStatus } from "@/lib/trade-types";
import { toast } from "sonner";

interface Trade {
  creatorId: string;
  traderRole: string;
  sellerAmount: number;
  buyerAmount: number;
  sellerEmail: string;
  buyerEmail: string;
  feeSplit: string;
  sellersToken: { name: string; image: string };
  buyersToken: { name: string; image: string };
  status: TradeStatus;
  roomId: string;
  participantId?: string;
  buyerPaymentStatus: string;
  sellerPaymentStatus: string;
  buyerWithdrawalStatus?: string;
  sellerWithdrawalStatus?: string;
}

export default function ViewRoomPage() {
  const router = useRouter();
  const params = useParams();
  const { roomid } = params;
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!roomid) return;
    if (!currentUser) {
      router.push("/auth/login?roomid=" + roomid);
      return;
    }

    let isMounted = true;
    let unsubscribeSnapshot: () => void;

    const setupStream = async () => {
      let isUserAdmin = false;
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists() && userDoc.data().isAdmin) {
          isUserAdmin = true;
          if (isMounted) setIsAdminUser(true);
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
      }

      if (!isMounted) return;

      const q = query(
        collection(db, "trades"),
        where("roomId", "==", roomid as string),
      );

      unsubscribeSnapshot = onSnapshot(
        q,
        (querySnapshot) => {
          if (!querySnapshot.empty) {
            const tradeDoc = querySnapshot.docs[0];
            const tradeData = tradeDoc.data() as Trade;
            if (
              currentUser?.email === tradeData.sellerEmail ||
              currentUser?.email === tradeData.buyerEmail ||
              isUserAdmin
            ) {
              setTrade(tradeData);
            } else {
              setError("You are not authorized to view this trade.");
            }
          } else {
            setError("Trade not found.");
          }
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching trade:", err);
          setError("Failed to fetch trade details.");
          toast.error("Failed to fetch trade details.");
          setLoading(false);
        },
      );
    };

    setupStream();

    return () => {
      isMounted = false;
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [roomid, currentUser]);

  const userRole =
    trade && currentUser
      ? currentUser.email?.trim().toLowerCase() ===
        trade.sellerEmail?.trim().toLowerCase()
        ? "seller"
        : currentUser.email?.trim().toLowerCase() ===
            trade.buyerEmail?.trim().toLowerCase()
          ? "buyer"
          : null
      : null;

  const handleMakeDeposit = async () => {
    if (!trade || !currentUser || !userRole) {
      setError("Cannot process deposit. User or trade data is missing.");
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid);
    const q = query(
      collection(db, "trades"),
      where("roomId", "==", roomid as string),
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("Could not find the trade to update.");
      }
      const tradeDocRef = querySnapshot.docs[0].ref;

      await runTransaction(db, async (transaction) => {
        const tradeDoc = await transaction.get(tradeDocRef);
        const userDoc = await transaction.get(userDocRef);

        if (!tradeDoc.exists() || !userDoc.exists()) {
          throw new Error("Required data not found.");
        }

        const tradeData = tradeDoc.data() as Trade;
        const userData = userDoc.data();

        const requiredTokenName =
          userRole === "seller"
            ? tradeData.sellersToken.name
            : tradeData.buyersToken.name;
        const requiredAmount =
          userRole === "seller"
            ? tradeData.sellerAmount
            : tradeData.buyerAmount;
        const currentBalance = userData.balances?.[requiredTokenName] ?? 0;

        if (currentBalance < requiredAmount) {
          const missingAmount = requiredAmount - currentBalance;
          router.push(
            `/dashboard/deposit?token=${requiredTokenName}&amount=${missingAmount}`,
          );
          throw new Error("Redirecting to deposit page.");
        }

        const newBalance = currentBalance - requiredAmount;
        transaction.update(userDocRef, {
          [`balances.${requiredTokenName}`]: newBalance,
        });

        let newStatus: TradeStatus = tradeData.status;
        const updates: any = {};

        if (userRole === "seller") {
          updates.sellerPaymentStatus = "paid";
          if (tradeData.buyerPaymentStatus === "paid") {
            newStatus = "under_review";
          } else {
            newStatus = "seller_deposited";
          }
        } else {
          // buyer
          updates.buyerPaymentStatus = "paid";
          if (tradeData.sellerPaymentStatus === "paid") {
            newStatus = "under_review";
          } else {
            newStatus = "buyer_deposited";
          }
        }
        updates.status = newStatus;
        transaction.update(tradeDocRef, updates);
      });
    } catch (error: any) {
      if (error.message !== "Redirecting to deposit page.") {
        console.error("Deposit processing failed: ", error);
        setError(`Failed to process deposit: ${error.message}`);
      }
    }
  };

  const handleWithdrawToken = async () => {
    if (!trade || !currentUser || !userRole) return;
    if (trade.status !== "ready_to_withdraw") {
      toast.error("Both parties must deposit funds before withdrawal.");
      return;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const q = query(
      collection(db, "trades"),
      where("roomId", "==", roomid as string),
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        toast.error("Could not find the trade to update.");
        return;
      }
      const tradeDocRef = querySnapshot.docs[0].ref;

      await runTransaction(db, async (transaction) => {
        const tradeDoc = await transaction.get(tradeDocRef);
        const userDoc = await transaction.get(userRef);

        if (!tradeDoc.exists() || !userDoc.exists()) {
          throw new Error("A required document is missing.");
        }
        const tradeData = tradeDoc.data() as Trade;
        if (tradeData.status !== "ready_to_withdraw") {
          throw new Error("Trade is not ready for withdrawal.");
        }

        const userData = userDoc.data();
        let updates: any = {};

        if (userRole === "seller") {
          if (tradeData.sellerWithdrawalStatus === "withdrawn") {
            throw new Error("You have already withdrawn your funds.");
          }
          const tokenName = tradeData.buyersToken.name;
          const amount = tradeData.buyerAmount;
          const newBalance = (userData.balances?.[tokenName] ?? 0) + amount;

          transaction.update(userRef, {
            [`balances.${tokenName}`]: newBalance,
          });
          updates.sellerWithdrawalStatus = "withdrawn";

          if (tradeData.buyerWithdrawalStatus === "withdrawn") {
            updates.status = "completed";
          }
        } else if (userRole === "buyer") {
          if (tradeData.buyerWithdrawalStatus === "withdrawn") {
            throw new Error("You have already withdrawn your funds.");
          }
          const tokenName = tradeData.sellersToken.name;
          const amount = tradeData.sellerAmount;
          const newBalance = (userData.balances?.[tokenName] ?? 0) + amount;

          transaction.update(userRef, {
            [`balances.${tokenName}`]: newBalance,
          });
          updates.buyerWithdrawalStatus = "withdrawn";

          if (tradeData.sellerWithdrawalStatus === "withdrawn") {
            updates.status = "completed";
          }
        }

        transaction.update(tradeDocRef, updates);
      });
      toast.success("Withdrawal processed successfully!");
    } catch (error: any) {
      console.error("Withdrawal failed: ", error);
      toast.error(`Withdrawal failed: ${error.message}`);
    }
  };

  const handleCancelTrade = async () => {
    if (!trade || !currentUser) {
      setError("Cannot cancel trade. User or trade data is missing.");
      return;
    }

    const q = query(
      collection(db, "trades"),
      where("roomId", "==", roomid as string),
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("Could not find the trade to update.");
      }
      const tradeDocRef = querySnapshot.docs[0].ref;

      await runTransaction(db, async (transaction) => {
        const tradeDoc = await transaction.get(tradeDocRef);
        if (!tradeDoc.exists()) {
          throw new Error("Trade document not found.");
        }

        const tradeData = tradeDoc.data() as Trade;

        if (
          tradeData.status === "completed" ||
          tradeData.status === "cancelled"
        ) {
          throw new Error("This trade is already finalized or cancelled.");
        }

        let sellerUid, buyerUid;
        if (tradeData.traderRole === "seller") {
          sellerUid = tradeData.creatorId;
          buyerUid = tradeData.participantId;
        } else {
          sellerUid = tradeData.participantId;
          buyerUid = tradeData.creatorId;
        }

        if (tradeData.sellerPaymentStatus === "paid" && sellerUid) {
          const sellerUserRef = doc(db, "users", sellerUid);
          const sellerDoc = await transaction.get(sellerUserRef);
          if (sellerDoc.exists()) {
            const sellerData = sellerDoc.data();
            const newBalance =
              (sellerData.balances?.[tradeData.sellersToken.name] ?? 0) +
              tradeData.sellerAmount;
            transaction.update(sellerUserRef, {
              [`balances.${tradeData.sellersToken.name}`]: newBalance,
            });
          }
        }

        if (tradeData.buyerPaymentStatus === "paid" && buyerUid) {
          const buyerUserRef = doc(db, "users", buyerUid);
          const buyerDoc = await transaction.get(buyerUserRef);
          if (buyerDoc.exists()) {
            const buyerData = buyerDoc.data();
            const newBalance =
              (buyerData.balances?.[tradeData.buyersToken.name] ?? 0) +
              tradeData.buyerAmount;
            transaction.update(buyerUserRef, {
              [`balances.${tradeData.buyersToken.name}`]: newBalance,
            });
          }
        }

        transaction.update(tradeDocRef, { status: "cancelled" });
      });
    } catch (error: any) {
      console.error("Cancellation failed: ", error);
      setError(`Cancellation failed: ${error.message}`);
    }
  };

  const handleAdminApprove = async () => {
    if (!trade) return;
    try {
      const q = query(
        collection(db, "trades"),
        where("roomId", "==", roomid as string),
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const tradeDocRef = querySnapshot.docs[0].ref;
        await updateDoc(tradeDocRef, {
          status: "ready_to_withdraw",
        });
        toast.success("Trade approved successfully.");
      }
    } catch (err: any) {
      console.error("Error approving trade:", err);
      toast.error("Failed to approve trade.");
    }
  };

  const getTradeProgress = (
    trade: Trade,
  ): { percentage: number; statusText: string } => {
    const progressMap: {
      [key in TradeStatus]: { percentage: number; statusText: string };
    } = {
      pending: { percentage: 15, statusText: "Trade Created" },
      joined: { percentage: 30, statusText: "Both Parties Joined" },
      buyer_deposited: { percentage: 50, statusText: "Buyer Has Deposited" },
      seller_deposited: { percentage: 50, statusText: "Seller Has Deposited" },
      under_review: { percentage: 70, statusText: "Under Admin Review" },
      ready_to_withdraw: { percentage: 85, statusText: "Ready for Withdrawal" },
      completed: { percentage: 100, statusText: "Trade Completed" },
      cancelled: { percentage: 0, statusText: "Trade Cancelled" },
    };
    return (
      progressMap[trade.status] || {
        percentage: 0,
        statusText: "Unknown Status",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="flex justify-center items-center h-screen">
        Trade details not available.
      </div>
    );
  }

  const isDepositDisabled =
    (userRole === "seller" && trade.sellerPaymentStatus === "paid") ||
    (userRole === "buyer" && trade.buyerPaymentStatus === "paid") ||
    !["joined", "buyer_deposited", "seller_deposited"].includes(trade.status);

  const isWithdrawDisabled =
    trade.status !== "ready_to_withdraw" ||
    (userRole === "seller" && trade.sellerWithdrawalStatus === "withdrawn") ||
    (userRole === "buyer" && trade.buyerWithdrawalStatus === "withdrawn");
  const isCancelDisabled =
    trade.status === "completed" || trade.status === "cancelled";

  const { percentage, statusText } = getTradeProgress(trade);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Trade Room</CardTitle>
          <CardDescription>Trade ID: {trade.roomId}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-base font-medium text-blue-700">
                Trade Progress
              </span>
              <span className="text-sm font-medium text-blue-700">
                {statusText}
              </span>
            </div>
            <Progress
              value={percentage}
              className={trade.status === "cancelled" ? "bg-red-400" : ""}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Trade Info */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Trade Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="flex justify-between gap-4 whitespace-nowrap">
                      <p className="text-gray-500">Trade Status:</p>
                      <p
                        className={`font-semibold ${trade.status === "cancelled" ? "text-red-500" : ""}`}
                      >
                        {trade.status}
                      </p>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between gap-4 whitespace-nowrap">
                        <p className="text-gray-500">Your Role:</p>
                        <p>{userRole}</p>
                      </div>
                      <div className="flex justify-between gap-4 whitespace-nowrap">
                        <p className="text-gray-500">Fee Payer:</p>
                        <p>{trade.feeSplit}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-3 mb-3">
                <CardHeader>
                  <CardTitle>
                    <h5>
                      <u>Seller's Details</u>
                    </h5>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <hr />
                  <div className="overflow-x-auto space-y-3 mt-3">
                    <div className="flex justify-between gap-4 whitespace-nowrap">
                      <p className="text-gray-500">Seller's ID:</p>
                      <p>{trade.sellerEmail}</p>
                    </div>

                    <div className="flex justify-between gap-4 whitespace-nowrap">
                      <p className="text-gray-500">Sending:</p>
                      <p>
                        {trade.sellerAmount} {trade.sellersToken.name}
                      </p>
                    </div>

                    <div className="flex justify-between gap-4 whitespace-nowrap">
                      <p className="text-gray-500">Receiving:</p>
                      <p>
                        {trade.buyerAmount} {trade.buyersToken.name}
                      </p>
                    </div>

                    <div className="flex justify-between gap-4 whitespace-nowrap">
                      <p className="text-gray-500">Payment Status:</p>
                      <p>
                        <span
                          className={`badge ${trade.sellerPaymentStatus === "paid" ? "badge-success text-white" : "badge-warning text-white"}`}
                        >
                          {trade.sellerPaymentStatus === "paid"
                            ? "Paid"
                            : "Pending"}
                        </span>
                      </p>
                    </div>

                    <div className="flex justify-between gap-4 whitespace-nowrap">
                      <p className="text-gray-500">Withdrawal Status:</p>
                      <p>
                        <span
                          className={`badge ${trade.sellerWithdrawalStatus === "withdrawn" ? "badge-success text-white" : "badge-secondary text-white"}`}
                        >
                          {trade.sellerWithdrawalStatus === "withdrawn"
                            ? "Withdrawn"
                            : "Pending"}
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-3">
                <CardHeader>
                  <CardTitle>
                    <h5>
                      <u>Buyer's Details</u>
                    </h5>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <hr />
                  <div className="overflow-x-auto space-y-3 mt-3">
                    <div className="flex justify-between gap-4 whitespace-nowrap">
                      <p className="text-gray-500">Buyer's ID:</p>
                      <p>
                        {trade.buyerEmail ? (
                          trade.buyerEmail
                        ) : (
                          <span className="text-yellow-500">
                            Waiting to join...
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex justify-between gap-4 whitespace-nowrap">
                      <p className="text-gray-500">Sending:</p>
                      <p>
                        {trade.buyerAmount} {trade.buyersToken.name}
                      </p>
                    </div>

                    <div className="flex justify-between gap-4 whitespace-nowrap">
                      <p className="text-gray-500">Receiving:</p>
                      <p>
                        {trade.sellerAmount} {trade.sellersToken.name}
                      </p>
                    </div>

                    <div className="flex justify-between gap-4 whitespace-nowrap">
                      <p className="text-gray-500">Payment Status:</p>
                      <p>
                        <span
                          className={`badge ${trade.buyerPaymentStatus === "paid" ? "badge-success text-white" : "badge-warning text-white"}`}
                        >
                          {trade.buyerPaymentStatus === "paid"
                            ? "Paid"
                            : "Pending"}
                        </span>
                      </p>
                    </div>

                    <div className="flex justify-between gap-4 whitespace-nowrap">
                      <p className="text-gray-500">Withdrawal Status:</p>
                      <p>
                        <span
                          className={`badge ${trade.buyerWithdrawalStatus === "withdrawn" ? "badge-success text-white" : "badge-secondary text-white"}`}
                        >
                          {trade.buyerWithdrawalStatus === "withdrawn"
                            ? "Withdrawn"
                            : "Pending"}
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trade.status === "pending" &&
                  currentUser?.uid !== trade.creatorId ? (
                    <div className="text-center p-4 border rounded-md">
                      <p className="font-semibold">
                        You have been invited to this trade.
                      </p>
                      <p className="text-gray-600 mt-2">
                        Please use the "Join Trade" button in the dashboard
                        sidebar and enter the Trade ID to proceed.
                      </p>
                    </div>
                  ) : trade.status === "pending" &&
                    currentUser?.uid === trade.creatorId && !isAdminUser ? (
                    <p className="text-gray-500 text-center">
                      Waiting for counterparty to join...
                    </p>
                  ) : (
                    <>
                      {isAdminUser && !userRole ? (
                        <div className="space-y-4">
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={trade.status !== "under_review"}
                            onClick={handleAdminApprove}
                          >
                            Approve Trade
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                className="w-full"
                                disabled={isCancelDisabled}
                              >
                                Cancel Trade
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently cancel the trade. If any funds have
                                  been deposited, they will be returned to the
                                  respective parties.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <AlertDialogAction onClick={handleCancelTrade}>
                                  Yes, Cancel Trade
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <div className="text-sm text-gray-500 p-4 bg-gray-100 rounded-md">
                            <div className="flex items-start">
                              <LuInfo className="mr-2 mt-1 h-4 w-4" />
                              <span>
                                Warning: As an Admin, only cancel this trade if there are irreconcilable errors.
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Button
                            className="w-full"
                            disabled={isDepositDisabled}
                            onClick={handleMakeDeposit}
                          >
                            Make Deposit
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            disabled={isWithdrawDisabled}
                            onClick={handleWithdrawToken}
                          >
                            {(userRole === "seller" && trade.sellerWithdrawalStatus === "withdrawn") || 
                             (userRole === "buyer" && trade.buyerWithdrawalStatus === "withdrawn") 
                              ? "Token Withdrawn" 
                              : "Withdraw Token"}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                className="w-full"
                                disabled={isCancelDisabled}
                              >
                                Cancel Trade
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently cancel the trade. If any funds have
                                  been deposited, they will be returned to the
                                  respective parties.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <AlertDialogAction onClick={handleCancelTrade}>
                                  Yes, Cancel Trade
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <div className="text-sm text-gray-500 p-4 bg-gray-100 rounded-md">
                            <div className="flex items-start">
                              <LuInfo className="mr-2 mt-1 h-4 w-4" />
                              <span>
                                Only cancel the trade if you are certain. This
                                action cannot be undone.
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
