import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminReleasesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Pending Releases</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Awaiting Verification</CardTitle>
          <CardDescription>
            Review and approve or deny milestone release requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Pending release requests will be displayed here.</p>
        </CardContent>
      </Card>
    </main>
  );
}
