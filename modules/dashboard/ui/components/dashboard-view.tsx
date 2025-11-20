// app/(dashboard)/page.tsx
import AddSubscription from './add-subscription';
import UsersList from './users-list';

async function fetchUsers() {
  
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/users`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  return res.json();
}

export default async function DashboardPage() {
  const users = await fetchUsers(); 
  

  return (
    <div className="p-6 bg-background">
      <AddSubscription />
      <UsersList initialUsers={users} />

    </div>
  );
}
