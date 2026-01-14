import { AlertCircle, HelpCircle } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function DatabaseFileLocatonHelpDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="cursor-pointer text-xs">
          <HelpCircle className="w-3 h-3 mr-1" />
          How to locate?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Locating Your Rekordbox Database</DialogTitle>
          <DialogDescription>
            The database location varies by operating system and Rekordbox version
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Windows */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                </svg>
              </div>
              <h3 className="font-semibold text-base">Windows</h3>
            </div>

            <div className="space-y-2 pl-10">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Rekordbox 6.x:</p>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  C:\Users\[YourUsername]\AppData\Roaming\Pioneer\rekordbox\datafile.edb
                </code>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Rekordbox 5.x and earlier:</p>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  C:\Users\[YourUsername]\AppData\Roaming\Pioneer\rekordbox\master.db
                </code>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Win + R</kbd>,
                type <code className="bg-muted px-1 rounded">%APPDATA%</code>, then navigate to Pioneer\rekordbox
              </p>
            </div>
          </div>

          {/* macOS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              </div>
              <h3 className="font-semibold text-base">macOS</h3>
            </div>

            <div className="space-y-2 pl-10">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Rekordbox 6.x:</p>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  ~/Library/Pioneer/rekordbox/datafile.edb
                </code>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Rekordbox 5.x and earlier:</p>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  ~/Library/Pioneer/rekordbox/master.db
                </code>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: In Finder, press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘ + Shift + G</kbd>
                and paste the path above
              </p>
            </div>
          </div>

          {/* Linux (Wine/Proton) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.581 19.049c-.55-.446-.336-1.431-.907-1.917.553-3.365-.997-6.331-2.845-8.232-1.551-1.595-1.051-3.147-1.051-4.49 0-2.146-.881-4.41-3.55-4.41-2.853 0-3.635 2.38-3.663 3.738-.068 3.262.659 4.11-1.25 6.484-2.246 2.793-2.577 5.579-2.07 7.057-.237.276-.557.582-1.155.835-1.652.72-.441 1.925-.898 2.78-.13.243-.192.497-.192.74 0 .75.596 1.399 1.679 1.302 1.461-.13 2.809.905 3.681.905.77 0 1.402-.438 1.696-1.041 1.377-.339 3.077-.296 4.453.059.247.691.917 1.141 1.662 1.141 1.631 0 1.945-1.849 3.816-2.475.674-.225 1.013-.879 1.013-1.488 0-.39-.139-.761-.419-.988z" />
                </svg>
              </div>
              <h3 className="font-semibold text-base">Linux (Wine/Proton)</h3>
            </div>

            <div className="space-y-2 pl-10">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Typical Wine prefix:</p>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  ~/.wine/drive_c/users/[username]/AppData/Roaming/Pioneer/rekordbox/datafile.edb
                </code>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                💡 Note: Path depends on your Wine prefix configuration. Check your Wine/Proton prefix location.
              </p>
            </div>
          </div>

          {/* Important Notes */}
          <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Important Notes
            </h4>
            <ul className="text-xs space-y-1.5 text-muted-foreground list-disc list-inside">
              <li>The database file is <strong>encrypted</strong> and requires your Rekordbox master password</li>
              <li>Rekordbox must be closed before accessing the database</li>
              <li>File names: <code className="bg-muted px-1 rounded">datafile.edb</code> (v6+) or <code className="bg-muted px-1 rounded">master.db</code> (v5-)</li>
              <li>Always backup your database before any operations</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
