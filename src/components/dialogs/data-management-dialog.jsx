import { useEffect, useState } from 'react';
import { useUIStore } from '@store';
import { CircleAlertIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@ui/field';
import { Input } from '@ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import { PasswordInput } from '@common/password-input';
import { dataService } from '@utils/data-service';

const typeLabels = {
  password: 'Passwords',
  totp: 'Codes',
  token: 'Tokens',
};

export const DataManagementDialog = () => {
  const dataManagementConfig = useUIStore((state) => state.dataManagementConfig);
  const closeDataManagement = useUIStore((state) => state.closeDataManagement);
  const setDataManagementMode = useUIStore((state) => state.setDataManagementMode);

  const mode = dataManagementConfig.mode || 'import';
  const [preview, setPreview] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState({});
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const applyPreview = (res) => {
    if (!res || res.total === 0) {
      setPreview(null);
      setSelectedTypes({});
      return false;
    }

    const initialSelection = {};
    Object.keys(res.stats).forEach((type) => {
      initialSelection[type] = true;
    });

    setPreview(res);
    setSelectedTypes(initialSelection);
    return true;
  };

  const loadPreviewData = async (fetchPromise, currentMode) => {
    setError('');
    try {
      const res = await fetchPromise;
      const hasData = applyPreview(res);
      if (!hasData && currentMode === 'import') {
        setError('No compatible entries found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    loadPreviewData(dataService.previewImport(file, dataManagementConfig.type), 'import');
    e.target.value = '';
  };

  const handleModeChange = async (val) => {
    if (mode !== val) setDataManagementMode(val);

    setPassword('');
    setError('');
    setPreview(null);

    if (val === 'export') {
      await loadPreviewData(dataService.previewExport(dataManagementConfig.type), val);
    }
  };

  const getFilteredData = () => preview?.data?.filter((item) => selectedTypes[item.type]) || [];

  const handleImport = async () => {
    setLoading(true);
    const dataToSave = getFilteredData();
    const res = await dataService.importData(dataToSave, password, preview.salt);

    if (res.success) {
      dataManagementConfig.onSuccess();
      handleClose();
      toast.success(`Successfully imported ${res.count} items!`);
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  const handleExport = async () => {
    if (!password) return setError('Enter password to protect file');
    const dataToExport = getFilteredData();

    if (dataToExport.length === 0) return setError('Please select at least one type to export');

    setLoading(true);
    const res = await dataService.exportData(dataToExport, password);
    if (res.success) {
      handleClose();
      toast.success(`Successfully exported ${res.count} items!`);
    } else if (res.error !== 'Cancelled') {
      setError(res.error);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setPreview(null);
    setSelectedTypes({});
    setPassword('');
    setError('');
    closeDataManagement();
  };

  useEffect(() => {
    const init = async () => {
      if (dataManagementConfig.isOpen && mode === 'export') {
        await loadPreviewData(dataService.previewExport(dataManagementConfig.type), mode);
      }
    };
    init();

    if (!dataManagementConfig.isOpen) {
      handleClose();
    }
  }, [dataManagementConfig.isOpen, mode]);

  const isNothingSelected = !Object.values(selectedTypes).some(Boolean);
  const toggleType = (type) => setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));

  return (
    <Dialog open={dataManagementConfig.isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="mt-5 sm:max-w-[350px]">
        <Tabs value={mode} onValueChange={handleModeChange} className="w-full gap-4">
          <DialogHeader>
            <DialogTitle>Data Management</DialogTitle>
            <TabsList variant="line" className="w-full">
              <TabsTrigger value="import">Import</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>
            <DialogDescription className="mt-2">
              {mode === 'import'
                ? `Here you can import ${dataManagementConfig.importedItems.toLowerCase()} to your database from JSON file.`
                : `Here you can export ${dataManagementConfig.importedItems.toLowerCase()} from your database to JSON file. All ${dataManagementConfig.importedItems.toLowerCase()} will be encrypted with a key derived from this password.`}
            </DialogDescription>
          </DialogHeader>

          <TabsContent value="import" className="flex flex-col gap-2">
            {!preview ? (
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="backup-file">Backup File</FieldLabel>
                <Input
                  autoFocus
                  id="backup-file"
                  type="file"
                  accept=".json"
                  onChange={handleFile}
                />
                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <FieldGroup className="max-h-27.5 gap-3 overflow-y-auto py-0.5">
                  {Object.entries(preview.stats).map(([type, count], index) => (
                    <FieldLabel key={`field-${type}-${index}`} htmlFor={`check-${type}`}>
                      <Field orientation="horizontal" className="!p-3">
                        <Checkbox
                          id={`check-${type}`}
                          checked={!!selectedTypes[type]}
                          onCheckedChange={() => toggleType(type)}
                        />
                        <FieldContent className="flex-row items-center gap-1">
                          <FieldTitle>
                            {typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1)}
                          </FieldTitle>
                          <FieldDescription>
                            ({count} {count > 1 ? 'items' : 'item'})
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  ))}
                </FieldGroup>
                <Field>
                  <FieldLabel htmlFor="decryption-password">Decryption Password</FieldLabel>
                  <PasswordInput
                    id="decryption-password"
                    type="password"
                    placeholder="Enter decryption password"
                    value={password}
                    onChange={(value) => setPassword(value)}
                    required
                  />
                  {error && <p className="text-destructive text-sm">{error}</p>}
                </Field>
              </div>
            )}
          </TabsContent>

          <TabsContent value="export" className="flex flex-col gap-2">
            {preview && preview.total > 0 ? (
              <div className="flex flex-col gap-3">
                <FieldGroup className="max-h-27.5 gap-3 overflow-y-auto py-0.5">
                  {Object.entries(preview.stats).map(([type, count]) => (
                    <FieldLabel key={`export-${type}`} htmlFor={`export-check-${type}`}>
                      <Field orientation="horizontal" className="!p-3">
                        <Checkbox
                          id={`export-check-${type}`}
                          checked={!!selectedTypes[type]}
                          onCheckedChange={() => toggleType(type)}
                        />
                        <FieldContent className="flex-row items-center gap-1">
                          <FieldTitle>{typeLabels[type] || type}</FieldTitle>
                          <FieldDescription>({count} items)</FieldDescription>
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  ))}
                </FieldGroup>

                <Field>
                  <FieldLabel htmlFor="encryption-password">Encryption Password</FieldLabel>
                  <PasswordInput
                    autoFocus
                    id="encryption-password"
                    type="password"
                    placeholder="Create encryption password"
                    value={password}
                    onChange={(value) => setPassword(value)}
                    required
                  />
                </Field>
              </div>
            ) : (
              <div className="bg-muted dark:bg-muted/30 text-muted-foreground flex w-full items-center justify-center gap-1.5 rounded-lg py-4 text-sm">
                <CircleAlertIcon className="size-4" />
                <p>No data available for export</p>
              </div>
            )}
            {error && <p className="text-destructive text-sm">{error}</p>}
          </TabsContent>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {mode === 'import' ? (
              <Button
                onClick={handleImport}
                disabled={loading || !preview || isNothingSelected || !password}
              >
                {!loading ? 'Import' : 'Importing...'}
              </Button>
            ) : (
              <Button onClick={handleExport} disabled={loading || !password || isNothingSelected}>
                {!loading ? 'Export' : 'Exporting...'}
              </Button>
            )}
          </DialogFooter>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
