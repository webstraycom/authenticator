import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useUIStore } from '@store';
import { dataService } from '@utils/data-service';

export const useDataManagement = () => {
  const dataManagementConfig = useUIStore((state) => state.dataManagementConfig);
  const closeDataManagement = useUIStore((state) => state.closeDataManagement);
  const setDataManagementMode = useUIStore((state) => state.setDataManagementMode);

  const mode = dataManagementConfig.mode || 'import';
  const type = dataManagementConfig.type;

  const [preview, setPreview] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { password: '' },
    shouldFocusError: true,
  });

  const isNothingSelected = !Object.values(selectedTypes).some(Boolean);
  const toggleType = (type) => setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  const globalError = errors.root?.globalError?.message;

  const setGlobalError = (message) => setError('root.globalError', { type: 'manual', message });

  const loadPreview = async (fetchPromise, isImportMode) => {
    clearErrors('root');
    try {
      const res = await fetchPromise;
      if (!res || res.total === 0) {
        setPreview(null);
        setSelectedTypes({});
        if (isImportMode) setGlobalError('No compatible entries found');
        return;
      }

      setPreview(res);
      setSelectedTypes(Object.fromEntries(Object.keys(res.stats).map((k) => [k, true])));
    } catch (err) {
      setGlobalError(err.message || 'Failed to load data');
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadPreview(dataService.previewImport(file, type), true);
    e.target.value = '';
  };

  const handleModeChange = async (newMode) => {
    if (mode === newMode) return;
    setDataManagementMode(newMode);

    reset({ password: '' });
    clearErrors('root');
    setPreview(null);
    setSelectedTypes({});

    if (newMode === 'export') {
      await loadPreview(dataService.previewExport(type), false);
    }
  };

  const handleClose = useCallback(() => {
    setPreview(null);
    setSelectedTypes({});
    reset({ password: '' });
    clearErrors('root');
    closeDataManagement();
  }, [closeDataManagement, reset, clearErrors]);

  const onSubmit = async (data) => {
    clearErrors('root');
    const filteredData = preview?.data?.filter((item) => selectedTypes[item.type]) || [];

    const isImport = mode === 'import';
    const actionPromise = isImport
      ? dataService.importData(filteredData, data.password, preview.salt)
      : dataService.exportData(filteredData, data.password);

    const res = await actionPromise;

    if (res.success) {
      if (isImport) dataManagementConfig.onSuccess?.();
      handleClose();
      toast.success(`Successfully ${mode}ed ${res.count} items!`);
    } else if (res.error !== 'Cancelled') {
      setGlobalError(res.error);
    }
  };

  useEffect(() => {
    if (dataManagementConfig.isOpen && mode === 'export') {
      loadPreview(dataService.previewExport(type), false);
    }
  }, [dataManagementConfig.isOpen, type, mode]);

  return {
    dataManagementConfig,
    mode,
    preview,
    selectedTypes,
    isNothingSelected,
    globalError,
    isSubmitting,
    register,
    errors,
    toggleType,
    handleFile,
    handleModeChange,
    handleClose,
    handleSubmit: handleSubmit(onSubmit),
  };
};
