import { toast } from 'sonner';
import { usePluginStore } from '@sdk/index';
import { pluginManager } from '@sdk/plugin-manager';

export const usePluginsLogic = () => {
  const installedPlugins = usePluginStore((state) => state.installedPlugins);
  const enabledPlugins = usePluginStore((state) => state.enabledPlugins);

  const handleTogglePlugin = async (pluginId) => {
    const pluginName = installedPlugins.find((p) => p.id === pluginId)?.title || 'Plugin';
    const isDisabling = enabledPlugins.includes(pluginId);

    toast.promise(pluginManager.togglePlugin(pluginId), {
      loading: isDisabling ? `Disabling ${pluginName}...` : `Enabling ${pluginName}...`,
      success: isDisabling ? `${pluginName} has been disabled` : `${pluginName} has been enabled`,
      error: `Failed to update ${pluginName}`,
    });
  };

  return {
    installedPlugins,
    enabledPlugins,
    handleTogglePlugin,
  };
};
