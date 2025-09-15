import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminRolesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Roles & Permissions</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Roles</CardTitle>
          <CardDescription>
            Define roles and their permissions within the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Role management interface will be displayed here.</p>
        </CardContent>
      </Card>
    </main>
  );
}
