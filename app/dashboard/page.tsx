import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {session?.user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="p-6 bg-card rounded-lg shadow">
          <h3 className="font-semibold mb-2">Total Properties</h3>
          <p className="text-2xl">0</p>
        </div>
        
        <div className="p-6 bg-card rounded-lg shadow">
          <h3 className="font-semibold mb-2">Active Listings</h3>
          <p className="text-2xl">0</p>
        </div>
        
        <div className="p-6 bg-card rounded-lg shadow">
          <h3 className="font-semibold mb-2">Total Views</h3>
          <p className="text-2xl">0</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-card rounded-lg shadow p-4">
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      </div>
    </div>
  );
}
