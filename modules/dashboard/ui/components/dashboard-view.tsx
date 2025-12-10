// app/(dashboard)/page.tsx
"use client";

import { Subscription } from '@/types/Subscription';
import AddSubscription from './add-subscription';
import SubscriptionTable from './subscriptions-table';
import { useEffect, useState, useCallback } from 'react';
import UsersStats from './users-list';

export default function DashboardPage() {
  const [data, setData] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions");
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return (
    <div className="px-6 pt-4 pb-5 bg-background">
      <AddSubscription onSubscriptionAdded={fetchSubscriptions} />
      <UsersStats data={data} loading={loading}/>
      <SubscriptionTable data={data} loading={loading} fetchSubscriptions={fetchSubscriptions} />
    </div>
  );
}