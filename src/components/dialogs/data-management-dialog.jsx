import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import { PasswordInput } from '@common/password-input';
import { useDataManagement } from '@hooks/use-data-management';
import { CircleAlertIcon } from 'lucide-react';
import { Checkbox } from '@ui/checkbox';
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from '@ui/field';
import { Input } from '@ui/input';

const TYPE_LABELS = {
  password: 'Passwords',
  totp: 'Codes',
  token: 'Tokens',
};

const DataTypesList = ({ mode, preview, selectedTypes, toggleType, handleFile, isSubmitting }) => {
  if (mode === 'import' && !preview) {
    return (
      <Field>
        <FieldLabel htmlFor="backup-file">Backup File</FieldLabel>
        <Input
          autoFocus
          id="backup-file"
          type="file"
          accept=".json"
          onChange={handleFile}
          className="text-muted-foreground"
          disabled={isSubmitting}
        />
      </Field>
    );
  }

  if (mode === 'export' && (!preview || preview.total === 0)) {
    return (
      <div className="bg-muted dark:bg-muted/30 text-muted-foreground flex w-full items-center justify-center gap-1.5 rounded-lg py-4 text-sm">
        <CircleAlertIcon className="size-4" />
        <p>No data available for export</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <FieldGroup className="max-h-27.5 gap-3 overflow-y-auto py-0.5">
        {Object.entries(preview.stats).map(([type, count]) => (
          <FieldLabel key={`${mode}-${type}`} htmlFor={`${mode}-check-${type}`}>
            <Field orientation="horizontal" className="!p-3">
              <Checkbox
                id={`${mode}-check-${type}`}
                checked={!!selectedTypes[type]}
                onCheckedChange={() => toggleType(type)}
                disabled={isSubmitting}
              />
              <FieldContent className="flex-row items-center gap-1">
                <FieldTitle>{TYPE_LABELS[type] || type}</FieldTitle>
                <FieldDescription>
                  ({count} {count > 1 ? 'items' : 'item'})
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        ))}
      </FieldGroup>
    </div>
  );
};

export const DataManagementDialog = () => {
  const {
    dataManagementConfig, mode, preview, selectedTypes, isNothingSelected,
    globalError, isSubmitting, register, errors, toggleType,
    handleFile, handleModeChange, handleClose, handleSubmit,
  } = useDataManagement();

  return (
    <Dialog open={dataManagementConfig.isOpen} onOpenChange={(open) => !open && !isSubmitting && handleClose()}>
      <DialogContent className="mt-5 sm:max-w-[350px]">
        <form onSubmit={handleSubmit} className="contents" noValidate>
          <Tabs value={mode} onValueChange={handleModeChange} className="w-full gap-4">
            <DialogHeader>
              <DialogTitle>Data Management</DialogTitle>
              <TabsList variant="line" className="w-full">
                <TabsTrigger value="import" disabled={isSubmitting}>Import</TabsTrigger>
                <TabsTrigger value="export" disabled={isSubmitting}>Export</TabsTrigger>
              </TabsList>
              <DialogDescription className="mt-2">
                {mode === 'import'
                  ? `Here you can import ${dataManagementConfig.importedItems.toLowerCase()} to your database from JSON file.`
                  : `Here you can export ${dataManagementConfig.importedItems.toLowerCase()} from your database to JSON file. All ${dataManagementConfig.importedItems.toLowerCase()} will be encrypted with a key derived from this password.`}
              </DialogDescription>
            </DialogHeader>

            <TabsContent value={mode} className="flex flex-col gap-2">
              <DataTypesList
                mode={mode}
                preview={preview}
                selectedTypes={selectedTypes}
                toggleType={toggleType}
                handleFile={handleFile}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </Tabs>

          {preview && (
            <PasswordInput
              label={mode === 'import' ? 'Decryption Password' : 'Encryption Password'}
              id="data-management-password"
              description={mode === 'import' ? 'Enter decryption password' : 'Create encryption password'}
              disabled={isSubmitting}
              error={errors.password}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long.'
                },
              })}
            />
          )}

          {globalError && <p className="text-destructive text-sm -mt-2">{globalError}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            {mode === 'import' ? (
              <Button type="submit" disabled={isSubmitting || isNothingSelected}>
                {!isSubmitting ? 'Import' : 'Importing...'}
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || isNothingSelected}>
                {!isSubmitting ? 'Export' : 'Exporting...'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
