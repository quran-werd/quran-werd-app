const {AndroidConfig, withStringsXml} = require('expo/config-plugins');

// Sets the launcher label without changing `name`, which Expo also uses to derive native project names.
function withAndroidAppName(config, appName) {
  return withStringsXml(config, config => {
    config.modResults = AndroidConfig.Strings.setStringItem(
      [AndroidConfig.Resources.buildResourceItem({name: 'app_name', value: appName})],
      config.modResults,
    );
    return config;
  });
}

module.exports = withAndroidAppName;
