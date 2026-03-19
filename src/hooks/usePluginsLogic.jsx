import { toast } from 'sonner';
import { usePluginStore } from '@sdk/index';
import { pluginManager } from '@sdk/PluginManager';

export const usePluginsLogic = () => {
  const installedPlugins = usePluginStore((state) => state.installedPlugins);
  const enabledPlugins = usePluginStore((state) => state.enabledPlugins);

  const handleTogglePlugin = async (pluginId) => {
    toast.promise(pluginManager.togglePlugin(pluginId), {
      loading: 'Updating plugins configuration...',
      success: 'Plugin has been toggled',
      error: 'Cannot toggle this plugin',
    });
  };

  return {
    installedPlugins,
    enabledPlugins,
    handleTogglePlugin,
  };
};
