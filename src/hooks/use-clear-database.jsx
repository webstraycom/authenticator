import { toast } from 'sonner';
import { useUIStore, useAuthStore } from '@store';
import { useDatabase } from '@hooks/use-database';
import { withDelay } from '@utils/delays';
import { usePluginStore } from '@sdk';

export const useClearDatabase = () => {
  const runWithVerification = useUIStore((state) => state.runWithVerification);
  const openConfirm = useUIStore((state) => state.openConfirm);
  const setScreen = useUIStore((state) => state.setScreen);
  const resetAuth = useAuthStore((state) => state.resetAuth);
  const { clearDatabase } = useDatabase();

  const performCleanup = () => {
    toast.promise(withDelay(clearDatabase()), {
      loading: 'Clearing database...',
      success: () => {
        resetAuth();
        usePluginStore.getState().disableAllPlugins();
        setScreen('passwords');
        return 'Database successfully cleared!';
      },
      error: 'Clearing failed',
    });
  };

  const handleClear = ({ withVerification = true } = {}) => {
    if (withVerification) {
      runWithVerification(performCleanup, {
        force: true,
        title: 'Clear Database?',
        description: (
          <>
            This action cannot be undone. This will permanently delete <strong>all data</strong>{' '}
            from your vault.
          </>
        ),
        buttonText: 'Clear',
      });
    } else {
      openConfirm({
        title: 'Clear Database?',
        description: (
          <>
            This action cannot be undone. This will permanently delete <strong>all data</strong>{' '}
            from your vault.
          </>
        ),
        buttonText: 'Clear',
        onConfirm: performCleanup,
      });
    }
  };

  return { handleClear };
};
