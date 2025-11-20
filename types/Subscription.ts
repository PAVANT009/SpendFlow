export interface Subscription {
  id: string;

  userId: string;

  name: string;

  category: "Entertainment" | "Productivity" | "Health & Fitness" | "Development" | "Cloud" | "Learning";

  description?: string | null;

  logo_url : string ;

  url?: string | null;

  notes? : string | null;

  amount: string;  

  currency: string;

  cycleType: "month" | "year";

  cycleCount: number;

  startBilling: Date;

  nextBilling: Date;

  reminder: boolean;

  createdAt: Date;

  updatedAt: Date;
}
