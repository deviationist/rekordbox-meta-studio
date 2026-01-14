import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { LibraryIndex, LibraryStatus } from '@/types/library';
import { useRoute } from '@/hooks/use-route';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  XCircle,
  Database,
  HardDrive,
  FileText,
  Lock,
  Unlock,
  Clock,
  Table as TableIcon,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  ChevronLeft,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StatusPageProps {
  library: LibraryIndex;
  status: LibraryStatus;
}

export default function Status({ library, status }: StatusPageProps) {
  const route = useRoute();
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  const breadcrumbs: BreadcrumbItem[] = useMemo(
    () => [
      {
        title: 'Libraries',
        href: route('libraries.index'),
      },
      { title: 'Status' },
    ],
    [route]
  );

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev => {
      const next = new Set(prev);
      if (next.has(tableName)) {
        next.delete(tableName);
      } else {
        next.add(tableName);
      }
      return next;
    });
  };

  const overallHealth = status.file.exists && status.database.canConnect;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Status - ${library.name}`} />
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{library.name}</h1>
            <p className="text-muted-foreground mt-1">Database Status & Statistics</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={route('libraries.index')}>
                <ChevronLeft className="h-4 w-4" />
                Go back
              </Link>
            </Button>
            <Button
              size="sm"
              className="cursor-pointer"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overall Health */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {overallHealth ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <CardTitle>Overall Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge variant={status.file.exists ? 'default' : 'destructive'}>
                {status.file.exists ? 'File Exists' : 'File Not Found'}
              </Badge>
              <Badge variant={status.database.canConnect ? 'default' : 'destructive'}>
                {status.database.canConnect ? 'Connected' : 'Cannot Connect'}
              </Badge>
              {status.file.exists && (
                <Badge variant={status.file.isWritable ? 'default' : 'secondary'}>
                  {status.file.isWritable ? 'Writable' : 'Read-only'}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              <CardTitle>File Information</CardTitle>
            </div>
            <CardDescription>Physical file details and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 md:col-span-2">
                <div className="text-sm font-medium text-muted-foreground">Path</div>
                <div className="text-sm font-mono bg-muted p-2 rounded break-all">
                  {status.file.path}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">File Size</div>
                <div className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {status.file.sizeFormatted}
                  <span className="text-muted-foreground">
                    ({status.file.size.toLocaleString()} bytes)
                  </span>
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <div className="text-sm font-medium text-muted-foreground">Permissions</div>
                <div className="text-sm flex items-center gap-2">
                  {status.file.isWritable ? (
                    <>
                      <Unlock className="h-4 w-4 text-green-500" />
                      <span>Writable</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 text-yellow-500" />
                      <span>Read-only</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Last Modified</div>
                <div className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {status.file.lastModified ? (
                    <>
                      {status.file.lastModifiedHuman}
                      <span className="text-muted-foreground">
                        ({status.file.lastModified})
                      </span>
                    </>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Statistics */}
        {status.database.canConnect && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <CardTitle>Database Statistics</CardTitle>
              </div>
              <CardDescription>Overview of database contents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-2xl font-bold">{status.database.totalTables}</div>
                  <div className="text-sm text-muted-foreground">Total Tables</div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {status.database.totalRows.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Rows</div>
                </div>
                {/*
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-2xl font-bold font-mono">
                    {status.database.connection_name}
                  </div>
                  <div className="text-sm text-muted-foreground">Connection Name</div>
                </div>
                */}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tables Details */}
        {status.database.canConnect && status.database.tables.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TableIcon className="h-5 w-5" />
                <CardTitle>Tables</CardTitle>
              </div>
              <CardDescription>
                Detailed information about each table in the database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {status.database.tables.map(table => (
                <Collapsible
                  key={table.name}
                  open={expandedTables.has(table.name)}
                  onOpenChange={() => toggleTable(table.name)}
                >
                  <div className="border rounded-lg">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {expandedTables.has(table.name) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <div className="text-left">
                            <div className="font-medium">{table.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {table.rowCount.toLocaleString()} rows • {table.columnCount} columns
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {table.rowCount.toLocaleString()}
                        </Badge>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t p-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Column Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Nullable</TableHead>
                              <TableHead>Primary Key</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {table.columns.map(column => (
                              <TableRow key={column.name}>
                                <TableCell className="font-mono text-sm">
                                  {column.name}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{column.type}</Badge>
                                </TableCell>
                                <TableCell>
                                  {column.nullable ? (
                                    <Badge variant="outline">Yes</Badge>
                                  ) : (
                                    <Badge variant="secondary">No</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {column.primaryKey && (
                                    <Badge>PK</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {(!status.file.exists || !status.database.canConnect) && (
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Issues Detected</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {!status.file.exists && (
                <div className="text-sm">
                  <strong>File Not Found:</strong> The database file does not exist at the specified path.
                </div>
              )}
              {status.file.exists && !status.database.canConnect && (
                <div className="text-sm">
                  <strong>Connection Failed:</strong> Unable to connect to the database file.
                  The file may be corrupted or encrypted.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
