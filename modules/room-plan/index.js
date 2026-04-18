// Runtime entry — re-exports the native module defined in index.ts
// The config plugin in app.json uses this file as well (withPlugins stub)
const { withPlugins } = require('@expo/config-plugins');
module.exports = (config) => withPlugins(config, []);
