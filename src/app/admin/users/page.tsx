import { UserManagement } from "@/components/admin/user-management";
import { getAllUsers } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminUsersPage() {
  let users;
  let error;
  try {
    users = await getAllUsers();
  } catch (e: any) {
    error = e.message;
  }


  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">User Management</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Configuration Required</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Admin Service Not Available</AlertTitle>
              <AlertDescription>
                <p>Could not fetch users because the Firebase Admin SDK is not configured correctly. This feature requires service account credentials to be set up.</p>
                <p className="mt-2">To resolve this, please follow these steps:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                    <li>Generate a new private key for your service account in the Firebase Console:
                        <br />
                        <Link href="https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk" target="_blank" className="text-primary hover:underline">
                            Project settings &gt; Service accounts &gt; Generate new private key
                        </Link>
                    </li>
                    <li>
                      Open the downloaded JSON file. Copy the `project_id`, `client_email`, and the entire `private_key` (including the `-----BEGIN...` and `-----END...` lines).
                    </li>
                    <li>
                      Paste these values into the corresponding variables in your `.env` file at the root of the project.
                    </li>
                     <li>
                      The `FIREBASE_PRIVATE_KEY` value in your `.env` file should be enclosed in double quotes (e.g., `FIREBASE_PRIVATE_KEY="..."`).
                    </li>
                    <li>Restart your development server completely to apply the changes.</li>
                </ol>
                <p className="text-xs mt-4">Error details: {error}</p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </main>
    );
  }

  return <UserManagement users={users || []} />;
}
