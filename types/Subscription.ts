export interface Subscription {
  id: string;
  userId: string;

  name: string;

  category:
    | "Entertainment"
    | "Productivity"
    | "Health & Fitness"
    | "Development"
    | "Cloud"
    | "Learning";

  description?: string | null;

  logo_url: string;

  url?: string | null;

  domain? : string | null;

  notes?: string | null;

  amount: string;
  currency: string;

  cycleType: "month" | "year";
  cycleCount: number;

  startBilling: string;
  nextBilling: string;

  reminder: boolean;

  createdAt: Date;
  updatedAt: Date;
}