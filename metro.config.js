const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);

// Make sure to use both NativeWind and Reanimated configs
module.exports = withNativeWind(config, { input: './global.css' });