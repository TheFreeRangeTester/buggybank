export type AccountSummary = {
  id: string;
  type: string;
  accountNumber: string;
  currency: string;
  balance: number;
};

export type DashboardPayload = {
  user: {
    id: string;
    fullName: string;
    email: string;
    qaAccess: boolean;
  };
  totalBalance: number;
  accounts: AccountSummary[];
};

export type TransactionItem = {
  id: string;
  createdAt: string;
  amount: number;
  note: string | null;
  status: string;
  direction: "incoming" | "outgoing";
  fromAccountNumber: string;
  toAccountNumber: string;
  counterpartyName: string;
};
