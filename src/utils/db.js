const Datastore = window.nw.require('@seald-io/nedb');
const path = window.nw.require('path');

export const db = new Datastore({
  filename: path.join(window.nw.App.dataPath, 'vault.db'),
  autoload: true,
});
