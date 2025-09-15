import { UserManagement } from "@/components/admin/user-management";
import { getAllUsers } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default async function AdminUsersPage() {
  const { users, error } = await getAllUsers();

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">User Management</h1>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not fetch users. The admin service may not be configured correctly.
            <br />
            <span className="text-xs">{error}</span>
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return <UserManagement users={users || []} />;
}
