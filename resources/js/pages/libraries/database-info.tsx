import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field";

export function DatabaseInfo() {
  return (
    <Field>
      <FieldLabel htmlFor="file-upload">
        SQLite Database File
      </FieldLabel>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Database cannot be changed after creation. Create a new library if you need to use a different database.
        </AlertDescription>
      </Alert>
    </Field>
  );
}
