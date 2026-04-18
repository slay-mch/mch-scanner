const { withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

/**
 * Config plugin that explicitly adds the RoomPlanNative pod to the iOS Podfile.
 * This bypasses Expo autolinking entirely — React Native discovers the module
 * via RCT_EXPORT_MODULE at runtime without any module registry involvement.
 */
function withRoomPlanPodfile(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfilePath)) {
        console.warn('[withRoomPlan] Podfile not found at', podfilePath);
        return config;
      }

      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (!podfile.includes("pod 'RoomPlanNative'")) {
        // Insert the pod after use_expo_modules!
        podfile = podfile.replace(
          /([ \t]*use_expo_modules!)/,
          `$1\n  pod 'RoomPlanNative', :path => '../modules/room-plan'`
        );
        fs.writeFileSync(podfilePath, podfile);
        console.log('[withRoomPlan] Added RoomPlanNative pod to Podfile');
      }

      return config;
    },
  ]);
}

module.exports = withRoomPlanPodfile;
