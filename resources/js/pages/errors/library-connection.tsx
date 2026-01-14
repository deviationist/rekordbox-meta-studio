import { Head, Link } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRoute } from '@/hooks/use-route';
import AppLayout from '@/layouts/app-layout';

interface LibraryConnectionErrorProps {
  message: string;
}

export default function LibraryConnectionError({ message }: LibraryConnectionErrorProps) {
  const route = useRoute();
  return (
    <AppLayout breadcrumbs={[]}>
      <Head title="Library Connection Error" />
      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-background">
        <div className="max-w-md w-full space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Cannot Connect to Library</AlertTitle>
            <AlertDescription className="mt-2">
              {message}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This may happen if:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>The database file has been moved or deleted</li>
              <li>The database password is incorrect</li>
              <li>The file path is no longer accessible</li>
              <li>The database file is corrupted</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="default">
              <Link href={route('libraries.index')}>
                Manage Libraries
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={route('libraries.index')}>
                Select Different Library
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
