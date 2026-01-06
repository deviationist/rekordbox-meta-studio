import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library } from '@/types/library';
import { useRoute } from 'ziggy-js';

interface LibraryFormProps {
  library?: Library;
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

  const [sourceType, setSourceType] = useState<'upload' | 'path'>(
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
      put(route('libraries.update', library.id));
    } else {
      post(route('libraries.store'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Library Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Library Name *</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          placeholder="My Rekordbox Library"
          required
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      {/* Database Source */}
      <div className="space-y-4">
        <Label>Database Source *</Label>
        <Tabs value={sourceType} onValueChange={(v) => setSourceType(v as 'upload' | 'path')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="path">File Path</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file_upload">SQLite Database File</Label>
              <Input
                id="file_upload"
                type="file"
                accept=".sqlite,.sqlite3,.db"
                onChange={(e) => setData('file_upload', e.target.files?.[0] || null)}
              />
              {errors.file_upload && (
                <p className="text-sm text-destructive">{errors.file_upload}</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="path" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file_path">Path to SQLite File</Label>
              <Input
                id="file_path"
                value={data.file_path}
                onChange={(e) => setData('file_path', e.target.value)}
                placeholder="/Users/username/Pioneer/rekordbox/master.db"
              />
              {errors.file_path && (
                <p className="text-sm text-destructive">{errors.file_path}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_rekordbox_folder"
                checked={data.is_rekordbox_folder}
                onCheckedChange={(checked) =>
                  setData('is_rekordbox_folder', checked as boolean)
                }
              />
              <Label htmlFor="is_rekordbox_folder" className="font-normal">
                This is a Rekordbox folder (includes artwork images)
              </Label>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Database Password (optional)</Label>
        <Input
          id="password"
          type="password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          placeholder="Leave empty for default password"
        />
        <p className="text-sm text-muted-foreground">
          Only needed if your database uses a custom encryption password
        </p>
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={processing}>
        {library ? 'Update Library' : 'Create Library'}
      </Button>
    </form>
  );
}
