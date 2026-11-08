const {withProjectBuildGradle} = require('expo/config-plugins');

/**
 * @notifee/react-native ships its `app.notifee:core` AAR as a local Maven
 * repo under its own `android/libs`, and normally self-registers that repo
 * from its own build.gradle. That self-registration doesn't run under
 * Expo/RN's settings-plugin-based autolinking, so `app.notifee:core:+`
 * fails to resolve. Registering the repo here (which does persist across
 * `expo prebuild`) is notifee's documented workaround for that gap.
 */
function withNotifeeAndroidMavenRepo(config) {
  return withProjectBuildGradle(config, config => {
    const marker = 'app.notifee/react-native/android/libs';
    if (config.modResults.contents.includes(marker)) {
      return config;
    }

    config.modResults.contents = config.modResults.contents.replace(
      /allprojects\s*{\s*repositories\s*{/,
      match =>
        `${match}\n        maven {\n            // ${marker}\n            url(new File(['node', '--print', "require.resolve('@notifee/react-native/package.json')"].execute(null, rootDir).text.trim(), '../android/libs'))\n        }`,
    );

    return config;
  });
}

module.exports = withNotifeeAndroidMavenRepo;
