import { createSDK, usePluginStore } from '@sdk';
import { db } from '@utils/db';

const path = window.require('path');
const fs = window.require('fs');
const nwShell = window.require('nw.gui').Shell;

export class PluginManager {
  static #instance;
  #isLoading = false;
  #pluginsDir = path.join(window.nw.App.dataPath, 'plugins');
  #watcher = null;
  #watcherTimer = null;

  constructor(database) {
    if (PluginManager.#instance) return PluginManager.#instance;
    this.db = database;

    if (!fs.existsSync(this.#pluginsDir)) {
      fs.mkdirSync(this.#pluginsDir, { recursive: true });
    }

    PluginManager.#instance = this;
  }

  async init() {
    if (this.#isLoading) return;
    this.#isLoading = true;

    try {
      const store = usePluginStore.getState();

      const settings = await this.db.findOne({ type: 'plugins_settings' });
      const enabledList = settings?.enabled || [];

      store.disableAllPlugins();
      store.setEnabledPlugins(enabledList);

      const folders = fs.readdirSync(this.#pluginsDir);
      const foundPlugins = await Promise.all(
        folders.map((folder) => this.#loadPlugin(path.join(this.#pluginsDir, folder), enabledList)),
      );

      store.setInstalledPlugins(foundPlugins.filter(Boolean));
    } finally {
      this.#isLoading = false;
    }
  }

  async #loadPlugin(pPath, enabledList) {
    const pkgPath = path.join(pPath, 'package.json');
    const indexPath = path.join(pPath, 'index.js');

    if (!fs.existsSync(pkgPath) || !fs.existsSync(indexPath)) return null;

    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (!enabledList.includes(pkg.name)) return pkg;

      const sdk = createSDK(pkg, this.db);

      const fileUrl = `file:///${indexPath.replace(/\\/g, '/')}?t=${Date.now()}`;
      const { default: initPlugin } = await import(/* @vite-ignore */ fileUrl);

      if (typeof initPlugin === 'function') {
        const cleanup = initPlugin(sdk);
        if (typeof cleanup === 'function') {
          usePluginStore.getState().registerDestructor(pkg.name, cleanup);
        }
      }
      return pkg;
    } catch (e) {
      console.error(`Failed to load plugin in ${pPath}:`, e);
      return null;
    }
  }

  async togglePlugin(pluginId) {
    const { enabledPlugins } = usePluginStore.getState();
    const newList = enabledPlugins.includes(pluginId)
      ? enabledPlugins.filter((id) => id !== pluginId)
      : [...enabledPlugins, pluginId];

    await this.db.update(
      { type: 'plugins_settings' },
      { $set: { enabled: newList } },
      { upsert: true },
    );
    await this.init();
  }

  openPluginsFolder() {
    nwShell.openItem(this.#pluginsDir);
  }

  startWatcher() {
    if (this.#watcher || !fs.existsSync(this.#pluginsDir)) return;
    this.#watcher = fs.watch(this.#pluginsDir, { recursive: true }, () => {
      clearTimeout(this.#watcherTimer);
      this.#watcherTimer = setTimeout(() => this.init(), 200);
    });
  }

  stopWatcher() {
    if (this.#watcherTimer) {
      clearTimeout(this.#watcherTimer);
      this.#watcherTimer = null;
    }
    if (this.#watcher) {
      this.#watcher.close();
      this.#watcher = null;
    }
  }
}

export const pluginManager = new PluginManager(db);
