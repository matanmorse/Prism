const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    name: "prism",
    executableName: "Prism",
    icon: path.resolve(__dirname, 'src/resources/prism-icon-64px.ico'),
    extraResource: [
      path.resolve(__dirname, 'node_modules/7zip-bin/win/x64/7za.exe'),
      path.resolve(__dirname, 'src/resources/RAHasher.exe')
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'prism',
        setupExe: "PrismSetup.exe",
        setupIcon: './src/resources/prism-icon-64px.ico',
        loadingGif: './src/resources/installer-gif.gif',
        shortcutLocations: ['Desktop', 'StartMenu']
      },
      platforms: ['win32']
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),
  ],
};
