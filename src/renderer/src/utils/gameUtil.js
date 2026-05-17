const hasConfiguredEmulator = async (fileExtension) => {
    const supportedEmulators = await window.configService.getSupportedEmulators(fileExtension);
    if (supportedEmulators.length === 0) return false;

    const emulatorsConfig = await window.configService.getEmulatorsConfig();
    return emulatorsConfig
        .filter(e => supportedEmulators.includes(e.name))
        .some(e => e.exePath);
};

export default hasConfiguredEmulator;