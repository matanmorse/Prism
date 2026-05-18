import { app } from 'electron';
import path from 'path';
import Store from 'electron-store'
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { metadataCache } from './metadataService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configRootPath = path.resolve(__dirname,'../../', 'config.json')
const config = JSON.parse(readFileSync(configRootPath, 'utf-8'));

const isDev = () => process.env.NODE_ENVIRONMENT === 'Development'

/* Dynamically load locations of helper exes from bundle/local */
const sevenZipPath = !app.isPackaged
  ? path.join(import.meta.dirname, '../../', 'node_modules', '7zip-bin', 'win', 'x64', '7za.exe')
  : path.join(process.resourcesPath, '7za.exe');

const raHasherPath = !app.isPackaged
  ? path.join(import.meta.dirname, '..', 'resources', 'RAHasher.exe')
  : path.join(process.resourcesPath, 'RAHasher.exe');

const getEmulatorPath = (name) => settingsStore.get(`${name}-exe-path`)
const getRomFolderPath = () => settingsStore.get('romfolder-path')

var settingsDir = ""

app.whenReady().then(() => {
    settingsDir = path.join(app.getPath('userData'), 'settings')
});

const resetSettings = (emulatorName) => {
    resetEmulatorPath(emulatorName)
}

/* Whether the user has configured an path for all supported emulators and ROM folder*/
const hasSettings = () => {
    return {
        citra: hasEmulator('Citra'),
        melonds: hasEmulator('MelonDS'),
        romFolder: !(getRomFolderPath() === '' || getRomFolderPath() == undefined),
    }
}

/* Whether the user has configured a path for the given emulator key*/
const hasEmulator = (name) => {
    const emulatorPath = settingsStore.get(`${name}-exe-path`)
    return !(emulatorPath == undefined )
    // return !(getEmulatorPath(`${name}-exe-path`) === '' || getEmulatorPath(`${name}-exe-path`) == undefined)
}

const settingsStore = new Store({
    name: 'settings',
    cwd: settingsDir,
})

const setEmulatorPath = (name, path) => {
    console.log(`setting ${name} to ${path}`)
    settingsStore.set(`${name}-exe-path`, path)
}

const resetEmulatorPath = (name) => {
    console.log(`resetting path for emulator ${name}`)
    settingsStore.delete(`${name}-exe-path`)
}

const setRomFolderPath = (value) => {
    console.log(`setting rom folder path to ${value}`)
    settingsStore.set('romfolder-path', value)
}

const resetRomFolderPath = () => {
    console.log('resetting rom folder path')
    settingsStore.delete('romfolder-path')
}

/* List of all emulators' keys*/
const getEmulators = () => {
    const emulators = []
    config.emulators.forEach(element => {
          emulators.push(element.name)
    });
    return emulators;
}

/* List of all emulators' "pretty names" */
const getEmulatorsPrettyNames = () => {
    const emulatorsPrettyNames = []
    config.emulators.forEach(element => {
        emulatorsPrettyNames.push(element.prettyName)
    });
    return emulatorsPrettyNames
}

const getEmulatorsConfig = () => {
    var emulators = config.emulators;

    /* Add paths of emulators, if they exist */
    for (const emulator of emulators) {
        emulator.exePath = getEmulatorPath(emulator.name)
    }
    emulators.find(x=>x.name==='Rom Folder').folderPath = getRomFolderPath();

    return emulators
}

const getSupportedEmulators = (fileFormat) => {
    const res = config.fileFormats[fileFormat.replace('.','')] ?? [];
    return res;
}

/* When multiple emulators support a single format, remember which one to use in metadata store */
const setPreferredEmulator = (romPath, emulatorName) => {
    console.log('[Config Service] Setting preferred emulator for ', romPath, 'to', emulatorName)
    const metadata = metadataCache.get('metadata', {})
    metadata[romPath] = { ...metadata[romPath], preferred_emulator: emulatorName }
    metadataCache.set('metadata', metadata)
}
const getPreferredEmulator = (romPath) => {
    const metadata = metadataCache.get('metadata', undefined);
    if (!romPath || !metadata) return;
    return metadata[romPath].preferred_emulator
}

export {getEmulatorPath, getRomFolderPath, setEmulatorPath, 
    setRomFolderPath, hasSettings, resetSettings, getEmulators, 
    getEmulatorsPrettyNames, isDev, getEmulatorsConfig, resetRomFolderPath, hasEmulator,
    setPreferredEmulator, getPreferredEmulator,
    getSupportedEmulators, sevenZipPath, raHasherPath}

export default config;