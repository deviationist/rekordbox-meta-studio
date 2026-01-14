import { useMemo, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LibraryIndex } from '@/types/library';
import { route, useRoute } from 'ziggy-js';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, HeartPulse, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DatabaseFileLocatonHelpDialog } from './db-file-locaton-help-dialog';
import { getPlatform } from '@/lib/utils';

type DatabaseSource = 'upload' | 'path';

interface LibraryFormProps {
  library?: LibraryIndex;
}

function DatabaseStatusLink({ library }: { library?: LibraryIndex }) {
  if (!library) return null;
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={route('libraries.status', { library: library.id })}>
        <HeartPulse />
        Check DB Status
      </Link>
    </Button>
  );
}

export function LibraryForm({ library }: LibraryFormProps) {
  const route = useRoute();
  const { data, setData, post, put, processing, errors, transform } = useForm({
    name: library?.name || '',
    file_upload: null as File | null,
    file_path: library?.filePath || '',
    is_rekordbox_folder: library?.isRekordboxFolder || false,
    password: '',
  });

  const [sourceType, setSourceType] = useState<DatabaseSource>(
    library?.storedFile ? 'upload' : 'path'
  );

  // Transform data before sending to handle FormData for file uploads
  transform((data) => {
    const formData = new FormData();
    formData.append('name', data.name);

    if (sourceType === 'upload' && data.file_upload) {
      formData.append('file_upload', data.file_upload);
    } else if (sourceType === 'path') {
      formData.append('file_path', data.file_path);
      formData.append('is_rekordbox_folder', data.is_rekordbox_folder ? '1' : '0');
    }

    if (data.password) {
      formData.append('password', data.password);
    }

    // Laravel requires _method for PUT/PATCH with FormData
    if (library) {
      formData.append('_method', 'PUT');
    }
    return formData;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (library) {
      put(route('libraries.update', { library: library.id }));
    } else {
      post(route('libraries.store'));
    }
  };

  const defaultDbPath = useMemo(() => {
    switch (getPlatform()) {
      case 'windows':
        return 'C:\\Users\\[YourUsername]\\AppData\\Roaming\\Pioneer\\rekordbox\\master.db';
      case 'mac':
        return '/Users/username/Library/Pioneer/rekordbox/master.db';
    }
    return '';
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>{library ? 'Edit' : 'Create'} Library</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={sourceType} onValueChange={(v) => setSourceType(v as DatabaseSource)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="library-name">
                  Library Name
                </FieldLabel>
                <Input
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  id="library-name"
                  autoComplete="off"
                />
                {errors.name && <FieldError errors={[{ message: errors.name }]} />}
              </Field>
              <Field>
                <FieldLabel htmlFor="db-password">
                  Database Password
                </FieldLabel>
                <Input
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  id="db-password"
                  autoComplete="off"
                />
                {errors.password
                  ? <FieldError errors={[{ message: errors.password }]} />
                  : <FieldDescription>Leave empty to use default password.</FieldDescription>}
              </Field>
              <Field>
                <FieldLabel>
                  Database Source
                </FieldLabel>
                <TabsList defaultValue="upload" className="gap-x-2">
                  <TabsTrigger className="cursor-pointer select-none" disabled={!!library} value="path">Path to SQLite File</TabsTrigger>
                  <TabsTrigger className="cursor-pointer select-none" disabled={!!library} value="upload">SQLite Database File</TabsTrigger>
                </TabsList>
              </Field>
              <TabsContent value="upload">
                <Field>
                  <FieldLabel htmlFor="file-upload" className="flex justify-between items-baseline">
                    SQLite Database File
                    <DatabaseStatusLink library={library} />
                  </FieldLabel>
                  {library ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Database cannot be changed after creation. Create a new library if you need to use a different database.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <Input
                        id="file-upload"
                        type="file"
                        className="cursor-pointer"
                        accept=".sqlite,.sqlite3,.db"
                        onChange={(e) => setData('file_upload', e.target.files?.[0] || null)}
                      />
                      {errors.file_upload && <FieldError errors={[{ message: errors.password }]} />}
                    </>
                  )}
                </Field>
              </TabsContent>
              <TabsContent value="path">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="file-path" className="flex justify-between items-baseline">
                      <span>Path to SQLite File</span>
                      {library ? (
                        <DatabaseStatusLink library={library} />
                      ) : (
                        <DatabaseFileLocatonHelpDialog />
                      )}
                    </FieldLabel>
                    <Input
                      id="file-path"
                      value={data.file_path}
                      onChange={(e) => setData('file_path', e.target.value)}
                      placeholder={defaultDbPath}
                    />
                    {errors.file_path && <FieldError errors={[{ message: errors.file_path }]} />}
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox
                      checked={data.is_rekordbox_folder}
                      id="is-rekordbox-folder"
                      onCheckedChange={(checked) => setData('is_rekordbox_folder', checked as boolean)}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor="is-rekordbox-folder">
                        Is this a Rekordbox folder?
                      </FieldLabel>
                      <FieldDescription>
                        When checked the system will attempt to resolve artwork from the Rekordbox-folder.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldGroup>
              </TabsContent>
            </FieldGroup>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button variant="outline" asChild>
              <Link className="cursor-pointer" href={route('libraries.index')}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={processing}>
              {library ? 'Update' : 'Create'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </form>
  );
}
