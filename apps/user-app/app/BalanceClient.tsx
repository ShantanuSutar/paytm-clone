// app/BalanceClient.tsx
"use client";

import { useBalance } from "@repo/store/hooks/useBalance";

export default function BalanceClient() {
  const balance = useBalance();
  return <div>{balance}</div>;
}
